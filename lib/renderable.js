
import { default as mimeTypes } from 'mime-types'; // // pinstripe-if-client: const mimeTypes = undefined;
import { promisify } from 'util';
import { readFile } from 'fs';

import { Registrable } from './registrable.js';

export const Renderable = Class => (Class
    .include(Registrable)
    .staticProps({
        render(...args){
            return this.create(...args).render();
        },

        get staticImporter(){
            return dirPath => filePath => {
                const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');
                this.register(relativeFilePath).props({
                    async render(){
                        return [
                            200,
                            { 'Content-Type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
                            [ await promisify(readFile)(filePath) ]
                        ];
                    }
                });
            } 
        }
    })
    .props({
        initialize(environment){
            this.environment = environment;
        },

        render(){
            
        },

        __getMissing(name){
            return this.environment[name];
        }
    })
);
