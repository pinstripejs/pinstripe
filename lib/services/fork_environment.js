
import { defineService } from 'pinstripe';

import { Environment } from '../environment.js';

defineService('forkEnvironment', (parentEnvironment) => {
    const { environment, resetEnvironment } = Environment.new(parentEnvironment);
    return async fn => {
        const out = await fn(environment);
        await resetEnvironment();
        return out;
    };
});
