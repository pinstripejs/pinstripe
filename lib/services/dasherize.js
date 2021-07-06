
import { defineService } from 'pinstripe';
import { dasherize } from '../inflector.js'

defineService('dasherize', () => dasherize);
