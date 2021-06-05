
import { View } from '../view.js';

export default ({ forkEnvironment }) => {
    return (viewName, params = {}) => forkEnvironment(({ environment }) => {
        environment.params = { ...params };
        return View.render(viewName, environment);
     });
};
