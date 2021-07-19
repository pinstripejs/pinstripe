

import { Base } from '../base.js';
import { Registrable } from '../registrable.js';

export const Migration = Base.extend().open(Class => Class
    .include(Registrable)
    .open(Class => {
        const register = Class.register;
        Class.open(Class => Class
            .staticProps({
                register(name){
                    if(!name.match(/^\d+/)){
                        throw new Error(`Invalid migration name '${name}' - it must begin with a unix timestamp`);
                    }
                    return register.call(this, name);
                }
            })
        );
    })
    .staticProps({
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
