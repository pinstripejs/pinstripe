
import { View } from 'pinstripe';

export default Class => Class.props({
    create(){
        return (viewName, params = {}) => this.forkEnvironment(({ environment }) => {
            environment.params = { ...params };
            return View.render(viewName, environment);
        });
    }
});
