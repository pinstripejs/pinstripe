

import { randomUUID } from 'crypto';

import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { Validatable } from '../validatable.js';
import { Table } from './table.server.js';
import { Inflector } from '../inflector.js';
import { Union } from './union.server.js';
import { Sql } from './sql.server.js';

export const Row = Base.extend().open(Class => Class
    .include(Registrable)
    .include(Validatable)
    .open(Class => {
        const register = Class.register;
        Class.open(Class => Class
            .staticProps({
                register(name){
                    this.tableClass = Table.register(Inflector.pluralize(name));
                    return register.call(this, name);
                }
            })
        );
    })
    .hooks('beforeInsert', 'afterInsert', 'beforeUpdate', 'afterUpdate', 'beforeDelete', 'afterDelete')
    .staticProps({
        hasMany(name, ...args){
           this.tableClasshasMany(name, ...args);
           this.props({
               get [name](){
                    return new (this.constructor.tableClass)(this._database).idEq(this.id)[name];
               }
           });
        },

        hasOne(name, ...args){
            this.tableClasshasOne(name, ...args);
            this.props({
                get [name](){
                    return new (this.constructor.tableClass)(this._database).idEq(this.id)[name].first();
                }
            });
        },

        belongsTo(name, ...args){
            this.tableClassbelongsTo(name, ...args);
            this.props({
                get [name](){
                    return new (this.constructor.tableClass)(this._database).idEq(this.id)[name].first();
                }
            });
        },

        beforeInsertOrUpdate(fn){
            this.open(Class => Class
                .beforeInsert(fn)
                .beforeUpdate(fn)
            );
        },

        canBe(name){
            Union.register(Inflector.pluralize(name)).open(Class => {
                if(!Class.tableClasses.includes(this)){
                    Class.tableClasses.push(this);
                }
            })
        }
    })
    .props({

        initialize(database, fields = {}){
            this._database = database;
            this._fields = fields;
            this._alteredFields = {};
            this._updateLevel = 0;
        },

        async update(arg1){
            const fields = typeof arg1 == 'object' ? arg1 : {};
            const fn = typeof arg1 == 'function' ? arg1 : () => {};

            await this._database.transaction(async () => {
                this._updateLevel++;
                Object.assign(this, fields);
                await fn.call(this, this);
                this._updateLevel--;

                if(this._updateLevel == 0 && Object.keys(this._alteredFields).length){
                    await this.validate();
                    
                    if(this._fields.id === undefined){
                        await this._runBeforeInsertCallbacks();
                        await this._database.run`${this._generateInsertSql()}`;
                        await this._runAfterInsertCallbacks();
                    } else {
                        await this._runBeforeUpdateCallbacks();
                        await this._database.run`${this._generateUpdateSql()}`;
                        await this._runAfterUpdateCallbacks();
                    }
                }
            });

            return this;
        },

        async delete(){
            await this._database.transaction(async () => {
                await this._runBeforeDeleteCallbacks();
                await this._database.run`delete from ${Sql.escapeIdentifier(Inflector.pluralize(this.constructor.name))} where id = uuid_to_bin(${this.id})`;
                await this._runAfterDeleteCallbacks();
            });
            return this;
        },

        __setMissing(name, value){
            if(name == 'id'){
                throw "Id fields can't be set directly on a row";
            }
            if(this._updateLevel > 0 && this._fields[name] != value){
                this._alteredFields[name] = value;
            }
        },

        __getMissing(name){
            return {...this._fields, ...this._alteredFields}[name];
        },

        _generateInsertSql(){
            this._fields['id'] = randomUUID();
            this._alteredFields['id'] = this._fields['id'];

            return this._database.sql`
                insert into ${Sql.escapeIdentifier(Inflector.pluralize(this.constructor.name))}(
                    ${Object.keys(this._alteredFields).map((key, i) =>
                        this._database.sql`${[i > 0 ? ', ' : '']}${Sql.escapeIdentifier(key)}`
                    )}
                )
                values(
                    ${Object.keys(this._alteredFields).map((key, i) => {
                        const value = this._alteredFields[key];
                        const separator = [i > 0 ? ', ' : ''];
                        if(key.match(/^(id|.+Id)$/)){
                            return this._database.sql`${separator}uuid_to_bin(${value})`;
                        }
                        return this._database.sql`${separator}${value}`;
                    })}
                )
            `;
        },

        _generateUpdateSql(){
            return this._database.sql`
                update ${this._database.sql(Inflector.pluralize(this.constructor.name))}
                set ${Object.keys(this._alteredFields).map((key, i) => {
                    const value = this._alteredFields[key];
                    const separator = [i > 0 ? ', ' : ''];
                    if(key.match(/^(id|.+Id)$/)){
                        return this._database.sql`${separator}${Sql.escapeIdentifier(key)} = ${value}`;
                    }
                    return this._database.sql`${separator}${Sql.escapeIdentifier(key)} = uuid_to_bin(${value})`;
                })}
                where id = uuid_to_bin(${this._fields.id})
            `;
        }

    })
);
