
import { defineService } from 'pinstripe';
import { snakeify } from '../inflector.js'

defineService('snakeify', () => snakeify);
