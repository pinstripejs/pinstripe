
import { Base } from './base.js'
import { Registrable } from './registrable.js';

export const FileInterpreter = Base.extend().define(dsl => dsl
    .include(Registrable)
    .classProps({
        interpret(filePath){
            const matches = filePath.match(/^.*\.([^\/]+)$/);
            if(matches){
                return this.create(matches[1], filePath).interpret();
            }
            return () => {};
        }
    })
    .props({
        initialize(filePath){
            this.filePath = filePath;
        },

        interpret(){
           return () => {};
        }
    })
);

export const defineFileInterpreter = (name, fn) => {
    FileInterpreter.register(name).define(dsl => dsl
        .props({
            interpret(){
                return fn(this.filePath);
            }
        })
    );
};