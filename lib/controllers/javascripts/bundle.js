
import { Volume } from 'memfs';
import * as fs from 'fs';
import { ufs } from 'unionfs';
import webpack from 'webpack';

import { filePaths } from '../../importers/client.js';

let out;

export default async ({ project, renderHtml }) => {
    if(!out){
        const inputVolume = Volume.fromJSON({
            '/pinstripeInput.js': filePaths.map(filePath => `
                import '${filePath}';
            `).join('\n')
        });
        ufs.use(fs).use(inputVolume);

        const outputVolume = new Volume();

        const compiler = webpack({
            mode: 'development',
            entry: '/pinstripeInput.js',
            output: {
                path: '/',
                filename: 'pinstripeOutput.js',
            },
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
