
import { Environment } from 'pinstripe';

export default Class => Class.props({
    create(){
        const { environment, resetEnvironment } = Environment.new(this.environment);
        return async fn => {
            const out = await fn(environment);
            await resetEnvironment();
            return out;
        };
    }
});
