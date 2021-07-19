
import { snakeify } from 'pinstripe';

export default Class => Class.props({
    create(){
        return snakeify;
    }
});
