
import { defineService } from 'pinstripe';
import { Html } from '../html.js';

defineService('renderHtml', (...args) => Html.render(...args));
