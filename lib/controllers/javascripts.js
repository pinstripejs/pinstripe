
import { promisify } from 'util';
import { readFile, realpath } from 'fs';
import { fileURLToPath } from 'url';
import { Volume } from 'memfs';
import * as fs from 'fs';
import { ufs } from 'unionfs';
import webpack from 'webpack';

import { imported } from '../import_all.js';
import { filePaths as nodeWrapperFilePaths } from '../importers/node_wrapper.js';

let out;

export default async () => {
    if(!out){
        const nodeWrapperImportPath = await promisify(realpath)
            (fileURLToPath(`${import.meta.url}/../../node_wrapper.js`)
        );

        const filePaths = Object.keys(imported);
        const files = {};
        while(filePaths.length){
            const filePath = filePaths.pop();
            if(!filePath.match(/\/[^\/]+\.js$/)){
                continue;
            }
            const data = (await promisify(readFile)(filePath)).toString();
            files[filePath] = data.replace(/.*\/\/\s*pinstripe-server-side-only/g, '');
        }

        const inputVolume = Volume.fromJSON({
            ...files,
            '/pinstripeInput.js': `
                import { defineNodeWrapper } from '${nodeWrapperImportPath}';
                ${
                    nodeWrapperFilePaths.map((nodeWrapperFilePath, i) => {
                        const name = nodeWrapperFilePath.replace(/^.*\/([^\/\.]+).*$/, '$1');
                        return `
                            import * as nodeWrapper${i} from '${nodeWrapperFilePath}';
                            (({default: definition, ...options}) => {
                                if(!definition){
                                    return;
                                }
                                defineNodeWrapper(${JSON.stringify(name)}, options, definition);
                            })(nodeWrapper${i});
                        `
                    }).join('\n')
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
};
