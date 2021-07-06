
import { defineWidget } from 'pinstripe';

defineWidget('script', { selector: 'script[type="pinstripe"]'}, {
    initialize(...args){
        this.__proto__.initialize.call(this, ...args);
        new Function(this.text).call(this);
    }
});
