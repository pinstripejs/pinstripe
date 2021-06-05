
import { Base } from './base.js'
import { Registrable } from './registrable.js';

export const Controller = Base.extend().define(dsl => dsl
    .include(Registrable)
    .classProps({
        render(...args){
            return this.create(...args).render();
        }
    })
    .props({
        initialize(environment){
            this.environment = environment;
        },

        render(){
            
        }
    })
);

export const defineController = (name, fn) => {
    Controller.register(name).define(dsl => dsl
        .props({
            render(){
                return fn(this.environment);
            }
        })
    );
};
