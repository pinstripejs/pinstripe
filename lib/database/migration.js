

import { Base } from '../base.js';
import { Registrable } from '../registrable.js';

export const Migration = Base.extend().define(dsl => dsl
    .include(Registrable)
    .tap(Class => {
        const register = Class.register;
        Class.define(dsl => dsl
            .classProps({
                register(name){
                    if(!name.match(/^\d+/)){
                        throw `Invalid migration name '${name}' - it must begin with a unix timestamp`
                    }
                    return register.call(this, name);
                }
            })
        );
    })
    .classProps({
        get schemaVersion(){
            const matches = this.name.match(/^\d+/)
            if(matches){
                return parseInt(matches[0]);
            }
            return 0;
        }
    })
    .props({
        migrate(){

        }
    })
);

export const defineMigration = (name, fn) => {
    Migration.register(name).define(dsl => dsl
        .props({
            migrate: fn
        })
    );
};
