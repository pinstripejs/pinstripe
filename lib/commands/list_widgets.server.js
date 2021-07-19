
import chalk from 'chalk';
import { Widget } from 'pinstripe';

export default Class => Class.props({
    run(){
        console.log('');
        console.log('The following widgets are available:');
        console.log('');
        Object.keys(Widget.classes).sort().forEach(widgetName => {
            console.log(`  * ${chalk.green(widgetName)}`);
        });
        console.log('');
    }
});
