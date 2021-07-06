
import { defineService } from 'pinstripe';
import { capitalize } from '../inflector.js'

defineService('capitalize', () => capitalize);
