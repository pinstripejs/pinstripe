
import { dasherize } from 'pinstripe';

export default Class => Class.props({
    create(){
        return dasherize;
    }
});
