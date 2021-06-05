
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { project } from './project.js';
import { importAll } from './import_all.js';

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
        }
    })
);

export const defineCommand = (name, fn) => {
    Command.register(name).define(dsl => dsl
        .props({ 
            run(){
                return fn(this.environment);
            }
         })
    );
};

export const unregisterCommands = async () => {
    await importAll();
    if(await project.exists){
        Command.unregister('generate-project');
    } else {
        const allowedCommands = ['generate-project', 'list-commands']
        Object.keys(Command.classes).forEach(commandName => {
            if(!allowedCommands.includes(commandName)){
                Command.unregister(commandName);
            }
        });
    }
};
