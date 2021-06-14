
import { default as mimeTypes } from 'mime-types';
import { promisify } from 'util';
import { readFile } from 'fs';

const defineStaticController = async ({ filePath, relativeFilePath, defineController }) => {
    defineController(relativeFilePath, async () => [
        200,
        { 'Content-Type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
        [ await promisify(readFile)(filePath) ]
    ]);
};

export const js = async ({ filePath, relativeFilePath, defineController }) => {
    if(relativeFilePath.match(/static\//)){
        defineStaticController({ filePath, relativeFilePath, defineController });
    } else {
        const name = relativeFilePath.replace(/^\//, '').replace(/\.js$/, '');
        const { default: fn } = await import(filePath);
        if(typeof fn == 'function'){
            defineController(name, fn);
        }
    }
}

export default defineStaticController;
