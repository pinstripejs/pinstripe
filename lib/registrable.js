
export const Registrable = dsl => (dsl
    .classProps({

        get classes(){
            if(!this.hasOwnProperty('_classes')){
                this._classes = {};
            }
            return this._classes;
        },

        get isRegistered(){
            return this.classes[this.name] !== undefined;
        },
    
        register(name){
            if(!this.classes[name]){
                this.classes[name] = class extends this {
                    static get name(){
                        return name;
                    }
                };
            }
            return this.classes[name];
        },

        unregister(name){
            delete this.classes[name];
            return this;
        },

        for(name, options = {}){
            return this.classes[name] || (() => {
                if(options.registerIfNotExists){
                    return this.register(name);
                } else {
                    return class extends this {
                        static get name(){
                            return name;
                        }
                    };
                }
            })();
        },

        create(name, ...args){
            return new (this.for(name))(...args);
        }
    })
);
