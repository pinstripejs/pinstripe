
import { defineService } from 'pinstripe';
import { pluralize } from '../inflector.js'

defineService('pluralize', () => pluralize);
