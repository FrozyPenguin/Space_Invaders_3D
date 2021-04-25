import { gameEvent } from "../game.js";
import { Bonus } from "./bonus.js";

class healthBonus extends Bonus {
    constructor(position) {
        super(position);

        this.loadModel({
            src: "/src/medias/models/bonus/heart.gltf",
            scale: {
                x: 1000,
                y: 1000,
                z: 1000
            },
            rotate: {
                x: 90,
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