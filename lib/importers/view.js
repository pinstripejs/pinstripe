
import { default as mimeTypes } from 'mime-types';
import { promisify } from 'util';
import { readFile } from 'fs';

const defineStaticView = async ({ filePath, relativeFilePath, defineView }) => {
    defineView(relativeFilePath, async () => [
        200,
        { 'Content-Type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
        [ await promisify(readFile)(filePath) ]
    ]);
};

export const js = async ({ filePath, relativeFilePath, defineView }) => {
    if(relativeFilePath.match(/static\//)){
        defineStaticView({ filePath, relativeFilePath, defineView });
    } else {
        const name = relativeFilePath.replace(/^\//, '').replace(/\.js$/, '');
        const { default: fn } = await import(filePath);
        if(typeof fn == 'function'){
            defineView(name, fn);
        }
    }
}

export default defineStaticView;
