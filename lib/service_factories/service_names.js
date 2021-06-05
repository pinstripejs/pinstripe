
import { ServiceFactory } from '../service_factory.js';

export default () => Object.keys(ServiceFactory.classes).sort();
