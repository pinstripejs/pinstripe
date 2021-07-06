
import { readdir, stat, existsSync } from 'fs';
import { promisify } from 'util';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { defaultImporter } from './importers.js';

export const imported = {};
const importQueue = [];

let processImportQueuePromise = null;

export const importAll = (...dirPaths) => {
    if(dirPaths.length){
        importQueue.push(...dirPaths);
    }

    if(!processImportQueuePromise){
        processImportQueuePromise = processImportQueue().then(() => {
            processImportQueuePromise = null;
        });
    }

    return processImportQueuePromise;
};

const processImportQueue = async () => {
    while(importQueue.length > 0){
        await importAllRecursive(await normalizeDirPath(importQueue.shift()));
    }
};

const normalizeDirPath = async (dirPath) => {
    let out = dirPath;
    if(out.match(/^file:\/\//)){
        out = fileURLToPath(out);
    }
    const stats = await promisify(stat)(out);
    if(!stats.isDirectory()){
        out = dirname(out);
    }
    return out;
};

const importAllRecursive = async (dirPath, importer) => {
    if(existsSync(`${dirPath}/_importer.js`)) {
        importer = (await (
            await import(`${dir}/_importer.js`)
        ).default)(dirPath);
    } if(!importer){
        importer = defaultImporter(dirPath);
    }

    const items = await promisify(readdir)(dirPath);
    for(let i in items){
        const item = items[i];
        const current = `${dirPath}/${item}`;
        const stats = await promisify(stat)(current);
        if(stats.isDirectory()){
            await importAllRecursive(current, importer);
        } else if(!imported[current]) {
            imported[current] = true;
            if(current.match(/\/[^\.\/]+(\.server\.js|\.js)$/)){
                await (await import(current)).default;
            }
        }
    }
};

importAll(import.meta.url);

// import { readdir, stat, existsSync } from 'fs';
// import { promisify } from 'util';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// import { Importer } from './importer.js';

// const imported = {};
// const importQueue = [];

// let processImportQueuePromise = null;

// export const importAll = (...args) => {
//     if(args.length){
//         importQueue.push(...args);
//     }

//     if(!processImportQueuePromise){
//         processImportQueuePromise = processImportQueue().then(() => {
//             processImportQueuePromise = null;
//         });
//     }

//     return processImportQueuePromise;
// };

// const processImportQueue = async () => {
//     while(importQueue.length > 0){
//         await importAllRecursive(await normalizeDirPath(importQueue.shift()));
//     }
// }

// const normalizeDirPath = async (dirPath) => {
//     let out = dirPath;
//     if(out.match(/^file:\/\//)){
//         out = fileURLToPath(out);
//     }
//     const stats = await promisify(stat)(out);
//     if(!stats.isDirectory()){
//         out = dirname(out);
//     }
//     return out;
// };

// const importAllRecursive = async (dir, importer) => {
//     if(existsSync(`${dir}/_importer.js`)) {
//         importer = (Importer.create(await (
//             await import(`${dir}/_importer.js`)
//         ).default))(dir);
//     } if(!importer){
//         importer = Importer.create('default')(dir);
//     }

//     const items = await promisify(readdir)(dir);
//     for(let i in items){
//         const item = items[i];
//         const current = `${dir}/${item}`;
//         const stats = await promisify(stat)(current);
//         if(stats.isDirectory()){
//             await importAllRecursive(current, importer);
//         } else if(!imported[current]) {
//             imported[current] = true;
//             await importer(current);
//         }
//     }
// }

// importAll(`${import.meta.url}/../importers`);

// importAll(import.meta.url);
