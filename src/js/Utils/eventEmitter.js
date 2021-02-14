/**
 * Source
 * https://gist.github.com/mudge/5830382
 */

export class EventEmitter{

    constructor(){
      this.events = {};
    }

    _getEventListByName(eventName){
        if(typeof this.events[eventName] === 'undefined'){
            this.events[eventName] = new Set();
        }
        return this.events[eventName]
    }

    on(eventName, fn){
        this._getEventListByName(eventName).add(fn);
    }

    once(eventName, fn){
        const self = this;

        const onceFn = function(...args){
            self.removeListener(eventName, onceFn);
            fn.apply(self, args);
        };
        this.on(eventName, onceFn);
    }

    removeAllListeners() {
        Object.keys(this.events).forEach((event) =>
            this.events[event].splice(0, this.events[event].length),
        );
    }

    emit(eventName, ...args){
        this._getEventListByName(eventName).forEach(function(fn){

            fn.apply(this,args);

        }.bind(this));
    }

    removeListener(eventName, fn){
        this._getEventListByName(eventName).delete(fn);
    }
}