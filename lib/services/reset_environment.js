
import { defineService } from 'pinstripe';

defineService('resetEnvironment', ({ environment,  parentEnvironment }) => {
    return async () => {
        const names = Object.keys(environment._instances);
        while(names.length){
            const name = names.shift();
            const instance = await environment._instances[name];
            const isDestroyable  = instance != undefined && typeof instance.destroy == 'function';
            if(isDestroyable){
                const parentInstance = await parentEnvironment && parentEnvironment._instances[name];
                const isDefinedByParent = instance === parentInstance;
                if(!isDefinedByParent){
                    await instance.destroy();
                }
            }
        }
        environment._instances = {};
    };
});