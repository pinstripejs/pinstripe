
import { Command } from 'pinstripe';

export default Class => Class.props({
    create(){
        return (name, ...args) => this.forkEnvironment(environment => {
            environment.args = args;
            return Command.run(name, environment);
        });
    }
});
