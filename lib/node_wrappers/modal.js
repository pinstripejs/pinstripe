
import frame from './frame.js';

export default (dsl => dsl
    .include(frame)
    .tap(Class => {
        const { initialize } = Class.prototype;

        Class.define(dsl => dsl
            .props({
                initialize(...args){
                    initialize.call(this, ...args);
        
                    this.on('click', '.p-modal, .p-close', (event) => {
                        event.stopPropagation();
                        this.close();
                    });
                }
            })
        );
    })
    .props({
        close(){
            this.remove();
            if(!this.document.find('body').pop().children.filter((child) => child.is('.p-modal')).length){
                this.document.find('html').pop().removeClass('p-clip');
            }
        }
    })
);
