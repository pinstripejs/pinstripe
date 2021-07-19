
import chalk from 'chalk';
import { Controller } from 'pinstripe';

export default Class => Class.props({
    run(){
        console.log('');
        console.log('The following controllers are available:');
        console.log('');
        Object.keys(Controller.classes).sort().forEach(controllerName => {
            console.log(`  * ${chalk.green(controllerName)}`);
        });
        console.log('');
    }
});
