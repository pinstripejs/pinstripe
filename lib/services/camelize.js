
import { defineService } from 'pinstripe';
import { camelize } from '../inflector.js'

defineService('camelize', () => camelize);
