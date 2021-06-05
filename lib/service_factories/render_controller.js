
import { Controller } from '../controller.js';

export default ({ forkEnvironment }) => {
    return (controllerName, params = {}) => forkEnvironment(({ environment }) => {
        environment.params = { ...params };
        return Controller.render(controllerName, environment);
     });
};
