
export const Registrable = Class => Class.staticProps({
    classes: {},

    register(name){
        if(!this.classes[name]){
            this.classes[name] = this.extend().staticProps({
                get name(){
                    return name;
                }
            });
        }
        return this.classes[name];
    },

    unregister(name){
        delete this.classes[name];
        return this;
    },

    for(name){
        return this.classes[name] || this.extend().staticProps({
            get name(){
                return name;
            }
        });
    },

    create(name, ...args){
        return new (this.for(name))(...args);
    },

    get importer(){
        return dirPath => async filePath => {
            const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');
            const matches = relativeFilePath.match(/^(.*?)\.(client\.js|server\.js|js)$/)
            if(!matches || matches[1] == '_importer'){
                return;
            }
            const { default: fn } = await import(filePath);
            if(typeof fn != 'function'){
                return;
            }
            this.register(matches[1]).open(fn);
        };
    }
});
