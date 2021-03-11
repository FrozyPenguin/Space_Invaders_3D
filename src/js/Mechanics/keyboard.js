import { gameEvent } from '../game.js';
import THREEx from '../../lib/Threex/threex.keyboardstate.js';
import { changeMute } from '../domEvent/controls.js';

export class Keyboard {
    constructor() {
        this.state = new THREEx.KeyboardState();
    }

    unique() {
        // handle keydown, return early if event is an autorepeat
        this.state.domElement.addEventListener('keydown', function(event) {
            if (event.repeat) {
                return;
            }

            if (this.state.eventMatches(event, 'space')) {
                // On pourra par exemple mettre un parametre nombre de tire si on veut mettre un bonus de tire multiple
                gameEvent.emit('onDefenderShoot');
            }

            if(this.state.eventMatches(event, 'm')) {
                if(document.querySelector('#controls').style.display != "none") {
                    changeMute();
                }
            }

            if(this.state.eventMatches(event, 'i')) {
                gameEvent.emit('onToggleGodMode');
            }

            if(this.state.eventMatches(event, 'k')) {
                gameEvent.emit('onKillAll');
            }

            if(event.code.match(/^(Digit|Numpad)/i)) gameEvent.emit('onChangeCamera', { code: event.code.replace(/^(Digit|Numpad)/i, '') });

            if(this.state.eventMatches(event, 'b')) {
                gameEvent.emit('onShowBoxes');
            }

            if(this.state.eventMatches(event, 's')) {
                gameEvent.emit('onShowSkeletons');
            }
        }.bind(this))
    }

    loop(delta) {
        if(this.state.pressed('right') || this.state.pressed('left')) {
            gameEvent.emit('onDefenderMove', { direction: this.state.key, delta })
        }
    }
}