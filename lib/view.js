
import { Base } from './base.js'
import { Registrable } from './registrable.js';

export const View = Base.extend().define(dsl => dsl
    .include(Registrable)
    .classProps({
        render(name, params){
            return this.create(name).render(params);
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

export const defineView = (name, fn) => {
    View.register(name).define(dsl => dsl
        .props({
            render(){
                return fn(this.environment);
            }
        })
    );
};
