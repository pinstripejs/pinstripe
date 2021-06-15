
import { getAllProps } from './get_all_props.js'

export const overload = (variations = {}) => {
    const normalizedVariations = normalizeVariations(variations);
    return function out(...args){
        const types = extractTypes(args);
        let fn = normalizedVariations[types.join(', ')];
        while(!fn){
            fn = normalizedVariations[[ ...types, '...'].join(', ')];
            if(!types.length){
                break;
            }
            types.pop();
        }
        if(!fn){
            if(this){
                getAllProps(this).forEach(name => {
                    if(this[name] === out){
                        throw `Could not satisfy overloaded method ${name}(${extractTypes(args).join(', ')}).`;
                    }
                });
            }
            throw `Could not satisfy overloaded function (${extractTypes(args).join(', ')}).`;
        }
        return fn.call(this, ...args);
    };
};

const normalizeVariations = (variations) => {
    const out = {};
    Object.keys(variations).forEach(signature => {
        out[signature.trim().split(/\s*,\*/)] = variations[signature];
    });
    return out;
};

const extractTypes = (args) => args.map(arg => {
    if(Array.isArray(arg)){
        return 'array';
    }
    return typeof arg;
});
