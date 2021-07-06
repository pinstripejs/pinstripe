
import chalk from 'chalk';
import { defineCommand } from 'pinstripe';

import { NodeWrapper } from '../node_wrapper.js';

defineCommand('list-widgets', () => {
    console.log('');
    console.log('The following widgets are available:');
    console.log('');
    Object.keys(NodeWrapper.classes).sort().forEach(nodeWrapperName => {
        console.log(`  * ${chalk.green(nodeWrapperName)}`);
    });
    console.log('');
});