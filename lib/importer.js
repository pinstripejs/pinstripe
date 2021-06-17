

import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { defineCommand } from './command.js';
import { defineController } from './controller.js';
import { defineFileInterpreter } from './file_interpreter.js';
import { defineMigration } from './database/migration.js';
import { defineModel } from './database/row.js';
import { defineServiceFactory } from './service_factory.js';
import { defineView } from './view.js';
import { pluralize, singularize, snakeify, dasherize, capitalize, uncapitalize, pascalize, camelize } from './inflector.js';

export const Importer = Base.extend().define(dsl => dsl
    .include(Registrable)
    .classProps({
        async import(type, dirPath, filePath){
            return await this.for(type).new(dirPath, filePath).import();
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
        defineFileInterpreter,
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

defineImporter('importer', async ({ extension, filePath, relativeFilePath }) => {
    if(extension != 'js'){
        return;
    }
    const { default: fn } = await import(filePath);
    defineImporter(relativeFilePath.replace(/\.js$/, ''), fn);
});
