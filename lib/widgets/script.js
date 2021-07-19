
export default Class => Class.staticProps({ selector: 'script[type="pinstripe"]' }).props({
    initialize(...args){
        this.__proto__.initialize.call(this, ...args);
        new Function(this.text).call(this);
    }
});
