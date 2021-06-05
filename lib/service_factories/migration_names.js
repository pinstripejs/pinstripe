
import { Migration } from '../database/migration.js';

export default () => Object.keys(Migration.classes).sort();
