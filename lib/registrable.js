
export const Registrable = dsl => (dsl
    .classProps({

        get classes(){
            if(!this._classes){
                this._classes = {};
            }
            return this._classes;
        },
    
        register(name){
            if(!this.classes[name]){
                this.classes[name] = this.extend().define(({ classProps }) => classProps({
                    get name(){
                        return name;
                    }
                }));
            }
            return this.classes[name];
        },

        unregister(name){
            delete this.classes[name];
            return this;
        },

        for(name){
            return this.classes[name] || this.extend().define(({ classProps }) => classProps({
                get name(){
                    return name;
                }
            }));
        },

        create(name, ...args){
            return new (this.for(name))(...args);
        }
    })
);
