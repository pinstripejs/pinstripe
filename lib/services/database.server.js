
import { defineService } from 'pinstripe';
import { Database } from '../database.server.js';

defineService('database', {scope: 'root'}, environment => Database.new(environment));
