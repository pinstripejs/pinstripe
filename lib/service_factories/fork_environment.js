
import { Environment } from '../environment.js';

export default parentEnvironment => {
    const { environment, resetEnvironment } = Environment.new(parentEnvironment);
    return async fn => {
        const out = await fn(environment);
        await resetEnvironment();
        return out;
    };
};
