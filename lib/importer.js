

import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { defineCommand } from './command.js';
import { defineController } from './controller.js';
import { defineMigration } from './database/migration.js';
import { defineModel } from './database/row.js';
import { defineServiceFactory } from './service_factory.js';
import { defineView } from './view.js';
import { pluralize, singularize, snakeify, dasherize, capitalize, uncapitalize, pascalize, camelize } from './inflector.js';

export const Importer = Base.extend().define(dsl => dsl
    .include(Registrable)
    .tap(Class => {
        const register = Class.register;
        Class.define(dsl => dsl
            .classProps({
                register(name){
                    if(!name.match(/^[^\/]+\/[^\/]+$/)){
                        throw `Invalid importer name '${name}' - it must be in the form type/fileExtension`
                    }
                    return register.call(this, name);
                }
            })
        );
    })
    .classProps({
        async import(type, dirPath, filePath){
            const matches = filePath.match(/\.([^\/]+)$/);
            if(matches){
                const fileExtension = matches[1];
                const candidateClassName = `${type}/${fileExtension}`;
                if(this.classes[candidateClassName]){
                    return this.classes[candidateClassName].new(dirPath, filePath).import();
                }
                await this.for(`${type}/default`).new(dirPath, filePath).import();
            }
        },

        create(type){
            return (dirPath) => {
                return async (filePath) => {
                    await this.import(type, dirPath, filePath);
                };
            };
        }
    })
    .props({
        initialize(dirPath, filePath){
            this.dirPath = dirPath;
            this.filePath = filePath;
            this.relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');
            this.fileName = filePath.replace(/^.*\//, '');
            this.name = this.fileName.replace(/\..*$/, '');
            this.extension = this.fileName.replace(/^.*?\.(.*)$/, '$1');
        },

        defineCommand,
        defineController,
        defineMigration,
        defineModel,
        defineServiceFactory,
        defineView,

        pluralize,
        singularize,
        snakeify,
        dasherize,
        capitalize,
        uncapitalize,
        pascalize,
        camelize,

        get delegateTo(){
            return name => Importer.for(name).new(this.dirPath, this.filePath).import();
        },
        
        import(){
            
        }
    })
);

export const defineImporter = (name, fn) => {
    Importer.register(name).define(dsl => dsl
        .props({
            import(){
                if(this.filePath.match(/_importer.js$/)){
                    return;
                }
                return fn(this);
            }
        })
    );
};

defineImporter('importer/js', async ({ filePath, relativeFilePath }) => {
    const { default: fn } = await import(filePath);
    defineImporter(relativeFilePath.replace(/\.js$/, ''), fn);
});
