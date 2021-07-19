
import chalk from 'chalk';
import { ServiceFactory } from 'pinstripe';

export default Class => Class.props({
    run(){
        console.log('');
        console.log('The following services are available:');
        console.log('');
        Object.keys(ServiceFactory.classes).sort().forEach(serviceName => {
            console.log(`  * ${chalk.green(serviceName)}`);
        });
        console.log('');
    }
});
