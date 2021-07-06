
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { AsyncPathBuilder } from './async_path_builder.js';
import { overload } from './overload.js';

export const ServiceFactory = Base.extend().define(dsl => dsl
    .include(Registrable)
    .tap(Class => {
        const create = Class.create;
        Class.define(dsl => dsl
            .classProps({
                get scope(){
                    if(!this.hasOwnProperty('_scope')){
                        this._scope = 'current';
                    }
                    return this._scope;
                },

                ['dsl.scope'](scope){
                    this._scope = scope;
                },

                create(name, { parentEnvironment, environment }){
                    if(this.scope == 'root' && parentEnvironment !== undefined){
                        return parentEnvironment[name];
                    } else {
                        const instance = create.call(this, name, environment).create();
                        if(instance != undefined && typeof instance.then == 'function'){
                            return AsyncPathBuilder.new(instance);
                        }
                        return instance;
                    }
                }
            })
        )
    })
    .props({
        initialize(environment){
            this.environment = environment;
        },
        
        create(){

        },

        __getMissing(name){
            return this.environment[name];
        }
    })
);

export const defineService = overload({
    ['string, object, function'](name, options, fn){
        const { scope = 'current' } = options;
        ServiceFactory.register(name).define(dsl => dsl
            .scope(scope)
            .props({
                create(){
                    return fn.call(this, this);
                }
            })
        );
    },

    ['string, function'](name, fn){
        defineService(name, {}, fn);
    }
});
