
import { getAllProps } from './get_all_props.js';

export class Base {

    static open(fn){
        fn.call(this, this);
        return this;
    }

    static staticProps(...args){
        assignProps(this, ...args);
        return this;
    }

    static props(...args){
        assignProps(this.prototype, ...args);
        return this;
    }

    static include(...args){
        this.open(...args);
        return this;
    }

    static new(...args){
        return new this(...args);
    }

    static extend(){
        return class extends this {};
    }
    
    constructor(...args){
        let out = this.initialize(...args);
        if(typeof out == 'object' && typeof out.then == 'function'){
            return out.then(out => out || this.__proxy);
        }
        return out || this.__proxy;
    }

    initialize(){
        
    }

    get __proxy(){
        let out = this;

        const traps = {};

        const isGetMissingMethod = typeof this.__getMissing == 'function';
        const isSetMissingMethod = typeof this.__setMissing == 'function';
        const isCallMethod = typeof this.__call == 'function';

        if(isGetMissingMethod || isCallMethod){
            traps.get = (target, name) => {
                if(getAllProps(this).includes(name)){
                    return this[name];
                }
                if(isGetMissingMethod && name != 'then'){
                    return this.__proxy.__getMissing(name);
                }
            };
        }
        if(isSetMissingMethod || isCallMethod){
            traps.set = (target, name, value) => {
                if(getAllProps(this).includes(name)){
                    this[name] = value;
                } else if(isSetMissingMethod){
                    this.__setMissing(name, value);
                }
                return true;
            };
        }
        if(isCallMethod){
            out = () => {};
            traps.apply = (target, thisArg, args) => {
                return this.__call(...args);
            };
        }

        if(Object.keys(traps).length){
            out = new Proxy(out, traps);
        }
    
        return out;
    }

    get __this(){
        return this;
    }
    
};

const assignProps = (target, ...sources) => {
    sources.forEach(source => {
        Object.getOwnPropertyNames(source).forEach(name => {
            Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(source, name));
        });
    });
    return target;
};
