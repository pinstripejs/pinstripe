
import { promisify } from 'util';
import { readFile } from 'fs';
import { Volume } from 'memfs';
import * as fs from 'fs';
import { ufs } from 'unionfs';
import webpack from 'webpack';
import { Controller } from 'pinstripe';

import { imported } from '../import_all.js';

let out;

Controller.register('bundle.js').props({
    async render (){
        if(!out){
            const filePaths = Object.keys(imported);
            const files = {};
            while(filePaths.length){
                const filePath = filePaths.pop();
                const data = (await promisify(readFile)(filePath)).toString();
                files[filePath] = data.replace(/(.*)\/\/\s*pinstripe-if-client:\s*(.*)/g, '$2 // pinstripe-if-server: $1');
            }

            const inputVolume = Volume.fromJSON({
                ...files,
                '/pinstripeInput.js': `
                    ${
                        Object.keys(imported).filter(filePath => filePath.match(/\/[^\.\/]+(\.client\.js|\.js)$/)).map(filePath => `
                            import ${JSON.stringify(filePath)};
                        `).join('\n')
                    }
                `
            });
            ufs.use(fs).use(inputVolume);

            const outputVolume = new Volume();

            const compiler = webpack({
                mode: 'development',
                entry: '/pinstripeInput.js',
                output: {
                    path: '/',
                    filename: 'pinstripeOutput.js',
                }
            });
            compiler.inputFileSystem = ufs;
            compiler.outputFileSystem = outputVolume;
            out = await new Promise((resolve, reject) => {
                compiler.run((error) => {
                    if(error){
                        reject(error);
                    } else {
                        resolve(outputVolume.readFileSync('/pinstripeOutput.js'));
                    }
                })
            });   
        }
        return [ 200, {'Content-Type': 'text/javascript'}, [ out ]];
    }
});
