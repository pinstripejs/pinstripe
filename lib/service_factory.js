
import { Base } from './base.js';
import { Registrable } from './registrable.js'
import { AsyncPathBuilder } from './async_path_builder.js'

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

        }
    })
);

export const defineServiceFactory = (name, ...args) => {
    const [fn, options = {}] = args.reverse();
    const { scope } = Object.assign({ scope: 'current' }, options);
    ServiceFactory.register(name).define(dsl => dsl
        .scope(scope)
        .props({
            create(){
                return fn(this.environment);
            }
        })
    );
};
