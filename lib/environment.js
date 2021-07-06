
import { Base } from './base.js';
import { ServiceFactory } from './service_factory.js';

export const Environment = Base.extend().define(dsl => dsl
    .classProps({
        async run(fn){
            const instance = this.new();
            const out = await fn(instance);
            await instance.resetEnvironment();
            return out;
        }
    })
    .props({
        initialize(parentEnvironment){
            this.environment = this.__proxy;
            this.parentEnvironment = parentEnvironment;
            this._instances = {};
        },

        __getMissing(name){
            if(!this._instances.hasOwnProperty(name)){
                this._instances[name] = ServiceFactory.create(name, this);
            }
            return this._instances[name];
        },

        __setMissing(name, value){
            this._instances[name] = value;
        }
    })
);
