
import { project } from '../project.js';

export default Class => Class.props({
    create(){
        return project;
    }
});
