
import { Database } from '../database.js';

export const scope = 'root';

export default environment =>  Database.new(environment);
