
import { defineService } from 'pinstripe';
import { pascalize } from '../inflector.js'

defineService('pascalize', () => pascalize);
