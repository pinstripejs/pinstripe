
import { Inflector } from './inflector.js'

export const Hookable = Class => (Class
    .staticProps({
        hooks(...names){
            names.forEach(name => {
                const camelizedName = Inflector.camelize(name);
                const callbacks = `${camelizedName}Callbacks`;
                const _callbacks = `_${callbacks}`;

                this.open(Class => Class
                    .staticProps({
                        get [callbacks](){
                            if(!this.hasOwnProperty(_callbacks)){
                                this[_callbacks] = [];
                            }
                            return this[_callbacks];
                        },

                        [`Class.${camelizedName}`](fn){
                            this[callbacks].push(fn);
                        }
                    })
                    .props({
                        async [`_run${Inflector.pascalize(name)}Callbacks`](){
                            for(let i = 0; i < this.constructor[callbacks].length; i++){
                                await this.constructor[callbacks][i].call(this, this);
                            }
                        }
                    })
                );
            });
            return this;
        }
    })
);
