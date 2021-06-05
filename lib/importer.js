

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
    .classProps({
        async import(type, dirPath, filePath){
            const matches = filePath.match(/\.([^\/]+)$/);
            if(matches){
                const fileExtension = matches[1];
                await this.for(type).for(fileExtension).new(dirPath, filePath).import();
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
        
        import(){
            
        }
    })
);

export const defineImporter = (...args) => {
    const fn = args.pop();
    const [ type, fileExtension ] = args;
    let Class = Importer.register(type);
    if(fileExtension){
        Class = Class.register(fileExtension);
    }
    Class.define(dsl => dsl
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

defineImporter('importer', 'js', async ({ filePath, name }) => {
    const { default: defaultImporter = () => {}, ...fileExtensionImporters } = await import(filePath);
    defineImporter(name, defaultImporter);
    Object.keys(fileExtensionImporters).forEach(fileExtension => {
        defineImporter(name, fileExtension, fileExtensionImporters[fileExtension]);
    });
});
