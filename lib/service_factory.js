
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { AsyncPathBuilder } from './async_path_builder.js';
import { camelize } from './inflector.js';

export const ServiceFactory = Base.extend().open(Class => Class
    .include(Registrable)
    .open(Class => {
        const { register, create } = Class;
        Class.open(Class => Class
            .staticProps({
                register(name){
                    return register.call(this, camelize(name));
                },

                get scope(){
                    if(!this.hasOwnProperty('_scope')){
                        this._scope = 'current';
                    }
                    return this._scope;
                },

                scoped(scope){
                    this._scope = scope;
                    return this;
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
