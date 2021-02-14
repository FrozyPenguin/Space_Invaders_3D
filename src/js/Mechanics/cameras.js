import { PerspectiveCamera } from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';

// Création de la caméra principale
const main = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
main.position.y = global.invadersSize * 4;
main.position.z = -(global.invadersSize * 1.5 + global.invadersPadding) * ((global.nbInvaders / global.invadersPerLine) + global.turnBeforeDeath)

const camera1 = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
camera1.position.y = ((global.invadersPerLine + global.invadersPerLine) * (global.invadersSize + global.invadersPadding) / 1.5);
camera1.position.x = 0;
camera1.position.z = 0;
camera1.lookAt(0, 0, 0);
camera1.rotation.z = Math.PI;

const camera2 = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
const camera3 = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);

function changeView(code) {
    switch(code) {
        case 'Digit1':
            return main;
        case 'Digit2':
            return camera1;
        case 'Digit3':
            return camera2;
        case 'Digit4':
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