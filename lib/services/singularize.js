
import { defineService } from 'pinstripe';
import { singularize } from '../inflector.js';

defineService('singularize', () => singularize);
