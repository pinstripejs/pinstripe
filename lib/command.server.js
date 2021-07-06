
import { Base } from './base.js';
import { Registrable } from './registrable.js';

export const Command = Base.extend().define(dsl => dsl
    .include(Registrable)
    .classProps({
        run(name = 'list-commands', ...args){
            return this.create(name, ...args).run();
        }
    })
    .props({
        initialize(environment){
            this.environment = environment;
        },
        
        run(){
            console.error(`No such command "${this.constructor.name}" exists.`);
        },

        __getMissing(name){
            return this.environment[name];
        }
    })
);

export const defineCommand = (name, fn) => {
    Command.register(name).define(dsl => dsl
        .props({
            run(){
                return fn.call(this, this);
            }
        })
    );
};
