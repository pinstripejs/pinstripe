
import { defineWidget } from 'pinstripe';

const selector = function(){ return this.type == '#document'; }

defineWidget('document', { extends: 'frame', selector }, {
    initialize(...args){
        this.__proto__.initialize.call(this, ...args);

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
        this.__proto__.load.call(this, params);
        if(params._method == 'GET' && previousUrl != this.url.toString()){
            if(replace){
                history.replaceState(this.url.toString(), null, this.url.toString());
            } else {
                history.pushState(this.url.toString(), null, this.url.toString());
                window.scrollTo(0, 0);
            }
        }
    }
});

