
import { camelize } from 'pinstripe';

export default Class => Class.props({
    create(){
        return camelize;
    }
});
