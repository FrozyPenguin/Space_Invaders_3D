import { changePause } from "../domEvent/controls.js";
import { gameEvent } from "../game.js";

class Gamepad {
    constructor() {
        this.loop = false;
        this.previousTime = 0;

        this.initEvent();
    }

    initEvent() {
        function getGamepadLenght(gamepads) {
            let length = 0;
            Object.values(gamepads).forEach(gamepad => {
                if(gamepad) length++;
            });
            return length;
        }

        let gamepadLength = 0;
        window.addEventListener('gamepadconnected', (e) => {
            const gamepads = (navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : {}));
            gamepadLength = getGamepadLenght(gamepads);
            if(gamepadLength) this.loop = true;
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            const gamepads = (navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : {}));
            gamepadLength = getGamepadLenght(gamepads);
            if(!gamepadLength) this.loop = false;
        });
    }

    buttonPressed(b) {
        if (typeof(b) == "object") {
          return b.pressed;
        }
        return b == 1.0;
    }

    update(delta) {
        if(this.loop) {

            const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
            if (!gamepads) return;

            const gp = gamepads[0];

            const right = gp.buttons[15];
            const left = gp.buttons[14];
            const a = gp.buttons[0];
            const pause = gp.buttons[9];

            if (this.buttonPressed(right)) {
                gameEvent.emit('onDefenderMove', { direction: 'right', delta })
            }
            else if (this.buttonPressed(left)) {
                gameEvent.emit('onDefenderMove', { direction: 'left', delta })
            }
            else if(this.buttonPressed(a)) {
                if(this.previousTime === gp.timestamp) return;
                gameEvent.emit('onDefenderShoot');
            }
            else if(this.buttonPressed(pause)) {
                if(this.previousTime === gp.timestamp) return;
                if(document.querySelector('#controls').style.display != "none") {
                    changePause();
                }
            }

            this.previousTime = gp.timestamp;
        }
    }
}

export {
    Gamepad
}