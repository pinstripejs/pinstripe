
import { Command } from '../command.server.js';
import { defineService } from 'pinstripe';

defineService('runCommand', ({ forkEnvironment }) =>{
    return (name, ...args) => forkEnvironment(environment => {
        environment.args = args;
        return Command.run(name, environment);
    });
});
