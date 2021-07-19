
import chalk from 'chalk';
import { Command } from 'pinstripe';

export default Class => Class.props({
    run(){
        console.log('');
        console.log('The following commands are available:');
        console.log('');
        Object.keys(Command.classes).sort().forEach(commandName => {
            console.log(`  * ${chalk.green(commandName)}`);
        });
        console.log('');
    }
});
