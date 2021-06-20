
import { promisify } from 'util';
import { readFile } from 'fs';
import Handlebars from 'handlebars';

const normalizeParams = async (params) => {
    params = await params;
    if(Array.isArray(params)){
        const out = [];
        for(let i = 0; i < params.length; i++){
            out.push(await normalizeParams(params[i]));
        }
        return out;
    } else if(typeof params == 'object'){
        if(typeof params.toResponseArray == 'function'){
            const [,,body] = await params.toResponseArray();
            return body.join();
        }
        const out = {};
        const keys = Object.keys(params);
        for(let i = 0; i < keys.length; i++){
            const key = keys[i];
            out[key] = await normalizeParams(params[key]);
        }
        return out;
    }
    return params;
};

export default async filePath => {
    const template = Handlebars.compile((await promisify(readFile)(filePath)).toString());

    return async ({ renderHtml, params }) => renderHtml(template(await normalizeParams(params)));
};
