
import { default as mimeTypes } from 'mime-types';
import { promisify } from 'util';
import { readFile } from 'fs';

export default async ({ filePath, relativeFilePath, defineController }) => {
    defineController(relativeFilePath, async () => [
        200,
        { 'Content-Type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
        [ await promisify(readFile)(filePath) ]
    ]);
};
