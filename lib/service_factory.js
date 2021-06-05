
import { Base } from './base.js';
import { Registrable } from './registrable.js'
import { AsyncPathBuilder } from './async_path_builder.js'

export const ServiceFactory = Base.extend().define(dsl => dsl
    .include(Registrable)
    .tap(Class => {
        const create = Class.create;
        Class.define(dsl => dsl
            .classProps({
                create(...args){
                    const instance = create.call(this, ...args).create();
                    if(instance != undefined && typeof instance.then == 'function'){
                        return AsyncPathBuilder.new(instance);
                    }
                    return instance;
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

export const defineServiceFactory = (name, fn) => {
    ServiceFactory.register(name).define(dsl => dsl
        .props({
            create(){
                return fn(this.environment);
            }
        })
    );
};
