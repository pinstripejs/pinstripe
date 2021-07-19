
export default Class => Class.props({
    create(){
        return async () => {
            const names = Object.keys(this.environment._instances);
            while(names.length){
                const name = names.shift();
                const instance = await this.environment._instances[name];
                const isDestroyable  = instance != undefined && typeof instance.destroy == 'function';
                if(isDestroyable){
                    const parentInstance = await this.parentEnvironment && this.parentEnvironment._instances[name];
                    const isDefinedByParent = instance === parentInstance;
                    if(!isDefinedByParent){
                        await instance.destroy();
                    }
                }
            }
            this.environment._instances = {};
        };
    }
});
