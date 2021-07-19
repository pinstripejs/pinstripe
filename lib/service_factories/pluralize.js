
import { pluralize } from 'pinstripe';

export default Class => Class.props({
    create(){
        return pluralize;
    }
});
