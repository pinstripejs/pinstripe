
import { Controller } from 'pinstripe';

export default Class => Class.props({
    create(){
        return (controllerName, params = {}) => this.forkEnvironment(({ environment }) => {
            environment.params = { ...params };
            return Controller.render(controllerName, environment);
        });
    }
});
