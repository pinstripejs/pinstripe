
import { pascalize } from 'pinstripe';

export default Class => Class.props({
    create(){
        return pascalize;
    }
});
