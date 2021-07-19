
import { capitalize } from 'pinstripe';

export default Class => Class.props({
    create(){
        return capitalize;
    }
});
