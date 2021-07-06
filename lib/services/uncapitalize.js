
import { defineService } from 'pinstripe';
import { uncapitalize } from '../inflector.js'

defineService('uncapitalize', () => uncapitalize);
