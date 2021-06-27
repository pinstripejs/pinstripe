
export const selector = 'script[type="pinstripe"]';

export default (dsl => dsl
    .props({
        initialize(...args){
            this.constructor.__proto__.prototype.initialize.call(this, ...args);
            new Function(this.text).call(this);
        }
    })
);
