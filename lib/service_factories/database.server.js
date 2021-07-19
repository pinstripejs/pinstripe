
import { Database } from '../database.server.js';

export default Class => Class.staticProps({ scope: 'root' }).props({
    create(){
        return Database.new(this.environment);
    }
});

