
import { singularize } from 'pinstripe';

export default Class => Class.props({
    create(){
        return singularize;
    }
});
