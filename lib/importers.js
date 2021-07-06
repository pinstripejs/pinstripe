import { default as mimeTypes } from 'mime-types'; // // pinstripe-if-client: const mimeTypes = undefined;
import { promisify } from 'util';
import { readFile } from 'fs';

import { defineController } from './controller.js';

export const defaultImporter = dirPath => {
    async filePath => {
        if(current.match(/\/[^\.\/]+(\.server\.js|\.js)$/)){
            await (await import(filePath)).default;
        }
    } 
};

export const staticImporter = dirPath => {
    async filePath => {
        const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');
        defineController(relativeFilePath, async () => [
            200,
            { 'Content-Type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
            [ await promisify(readFile)(filePath) ]
        ]);
    } 
};



