
import chalk from 'chalk';
import { Model } from 'pinstripe';

export default Class => Class.props({
    run(){
        console.log('');
        console.log('The following models are available:');
        console.log('');
        Object.keys(Model.classes).sort().forEach(modelName => {
            console.log(`  * ${chalk.green(modelName)}`);
        });
        console.log('');
    }
});
