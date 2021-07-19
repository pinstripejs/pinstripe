
import { Html } from '../html.js';

export default Class => Class.props({
    create(){
        return (...args) => Html.render(...args);
    }
});
