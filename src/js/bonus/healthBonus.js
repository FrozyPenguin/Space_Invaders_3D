import { gameEvent } from "../game.js";
import { Bonus } from "./bonus.js";

class healthBonus extends Bonus {
    constructor(position) {
        super(position);

        this.loadModel({
            src: "/src/medias/models/bonus/heart.obj",
            mtl: "/src/medias/models/bonus/heart.mtl",
            scale: {
                x: 20,
                y: 20,
                z: 20
            },
            rotate: {
                x: 0,
                y: 180,
                z: 0
            }
        })
        .catch(err => {
            console.error(err);
        });
    }

    launchEffect() {
        gameEvent.emit('onGiveHealth');
    }
}

export {
    healthBonus
}