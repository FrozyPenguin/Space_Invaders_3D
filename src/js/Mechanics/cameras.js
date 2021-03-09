import { PerspectiveCamera } from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';

class Camera extends PerspectiveCamera {
    constructor() {
        super(80, window.innerWidth / window.innerHeight, 1, 1000);

        this.position
    }

    lookCenter() {
        this.lookAt(0, 0, 0);
    }
}

// TODO: Faire une classe parceque il faut changer les vues a chaque changement de niveau
// TODO: Supprimer global

// En créer une seul et juste changer sa position

// Création de la caméra principale
const main = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
main.position.y = global.invadersSize * 4;
main.position.z = -(global.invadersSize * 1.5 + global.invadersPadding) * ((global.nbInvaders / global.invadersPerLine) + global.turnBeforeDeath)

main.lookAt(0, 0, 0);

const camera1 = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
camera1.position.y = (global.invadersSize + global.invadersPadding) * ((global.nbInvaders / global.invadersPerLine) + global.turnBeforeDeath) * 1.5;
camera1.position.x = 0;
camera1.position.z = 0;
camera1.lookAt(0, 0, 0);
camera1.rotation.z = Math.PI;

const camera2 = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
const camera3 = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);

function changeView(code) {
    switch(code) {
        case '1':
            return main;
        case '2':
            return camera1;
        case '3':
            return camera2;
        case '4':
            return camera3;
        default:
            return;
    }
}

export default {
    main,
    camera1,
    camera2,
    camera3,
    changeView
}