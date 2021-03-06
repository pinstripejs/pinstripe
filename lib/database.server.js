
import mysql from 'mysql';

import { Base } from './base.js';
import { Sql } from './database/sql.server.js';
import { Table } from './database/table.server.js';
import { Row } from './database/row.server.js';
import { Migrator } from './database/migrator.server.js';

let schemaCache = {};

export const Database = Base.extend().open(Class => Class
    .props({
        async initialize({ config }){
            this._config = await config.database;
            this._sessionCache = {};
            this._transactionLevel = 0;
            if(await this.exists()){
                await this.run`use ${this}`;
            }
            this._isInitialized = true;
        },

        get sql(){
            return Sql.fromTemplate(this);
        },

        toSql(){
            return Sql.escapeIdentifier(this._config.database);
        },

        async run(...args) {
            return this._fetchRows(
                (await this.sql(...args)).toString()
            );
        },

        async exists(){
            return (
                await this.run`show databases`
            ).map(row => row['Database']).includes(this._config.database);
        },

        async create() {
            if(!(await this.exists())){
                await this.run`create database ${this}`;
                await this.run`use ${this}`;
            }
        },

        async drop() {
            if(await this.exists()){
                await this.run`drop database ${this}`;
            }
        },

        async tables(){
            const out = {}
            if(await this.exists()){
                const rows = await this.run`show tables`;
                rows.forEach(row => {
                    const name = Object.values(row)[0];
                    out[name] = this.__getMissing(name);
                });
            }
            return out;
        },

        addTable(name){
            return this[name].create();
        },

        removeTable(name){
            return this[name].drop();
        },

        async migrate(...args) {
            await (await new Migrator(this)).migrate(...args);
        },

        async transaction(fn){
            if(this._transactionLevel == 0){
                await this.run`start transaction`;
            }
            this._transactionLevel++;
            await fn();
            this._transactionLevel--;
            if(this._transactionLevel == 0){
                await this.run`commit`;
            }
        },

        async destroy() {
            if(this._transactionLevel > 0){
                this.run`rollback`;
            }
            this._transactionLevel = 0;
            await new Promise((resolve, reject) => {
                this._connection.end(error => error ? reject(error) : resolve());
            });
        },

        __getMissing(name){
            return Table.create(name, this);
        },

        async __beforeInspect(){
            this._inspectInfo = {
                config: this._config,
                tables: Object.keys(await this.tables())
            };
        },

        __inspect(){
            return `Database ${JSON.stringify(this._inspectInfo, null, 2)}`;
        },

        _fetchRows(query){
            return new Promise((resolve, reject) => {
                query = query.toString();
                if(query.match(/^\s*(create|drop|alter)/im)){
                    schemaCache = {};
                } else if(query.match(/^\s*(create|drop|alter|insert|update)/im)){
                    this._sessionCache = {};
                }

                let cache;
                if(query.match(/^\s*(show|describe)/im)){
                    cache = schemaCache;
                } else if(query.match(/^\s*select/im)){
                    cache = this._sessionCache;
                }
                
                if(cache && cache[query]){
                    resolve(this._mapRows(cache[query]));
                    return;
                }

                if(this._isInitialized){
                    console.log(`Query: ${query}\n`);
                }

                this._connection.query(query, (error, rows) => {
                    if(error){
                        reject(error);
                    } else {
                        if(!Array.isArray(rows)){
                            rows = [rows || {}];
                        }

                        if(cache){
                            cache[query] = rows;
                        }

                        resolve(this._mapRows(rows));
                    }
                });
            });
        },

        get _connection(){
            if(!this.__connection){
                const { database, ...config } = this._config;
                this.__connection = mysql.createConnection(config);
                this.__connection.connect();
            }
            return this.__connection;
        },

        _mapRows(rows){
            return rows.map(row => {
                const { _type, ...fields } = row;
                if(_type !== undefined){
                    return Row.create(_type, this, fields);
                }
                return fields;
            });
        }

    })
);
