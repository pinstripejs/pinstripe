
import frame from './frame.js';

export const selector = function(){ return this.type == '#document'; };

export default dsl => (dsl
    .include(frame)
    .tap(Class => {
        const { initialize, load } = Class.prototype;
        
        Class.define(dsl => dsl
            .props({
                initialize(...args){
                    initialize.call(this, ...args);
        
                    window.onpopstate = (event) => {
                        this.load({ _url: event.state || window.location }, true);
                    };
                    window._nodeWrapper = this;
                },

                get progressBar(){
                    if(!this._progressBar){
                        this._progressBar = this.find('#p-progress-bar').pop()
                    }
                    return this._progressBar;
                },
            
                load(params = {}, replace = false){
                    const previousUrl = this.url.toString()
                    load.call(this, params);
                    if(params._method == 'GET' && previousUrl != this.url.toString()){
                        if(replace){
                            history.replaceState(this.url.toString(), null, this.url.toString());
                        } else {
                            history.pushState(this.url.toString(), null, this.url.toString());
                            window.scrollTo(0, 0);
                        }
                    }
                }
            })
        );
    })
);

