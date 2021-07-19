
import { uncapitalize } from 'pinstripe';

export default Class => Class.props({
    create(){
        return uncapitalize;
    }
});
