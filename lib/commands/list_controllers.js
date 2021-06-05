
import chalk from 'chalk';

export default ({ controllerNames }) => {
    console.log('');
    console.log('The following controllers are available:');
    console.log('');
    controllerNames.forEach(controllerName => {
        console.log(`  * ${chalk.green(controllerName)}`);
    });
    console.log('');
};
