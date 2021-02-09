import { GridHelper, AxesHelper } from '../../lib/Three.js/build/three.module.js';
import { OrbitControls } from '../../lib/Three.js/examples/jsm/controls/OrbitControls.js';
import global from '../global.js';

// Ajoute les différents helpers
const helpers = (scene) => {
    const gridHelper = new GridHelper(global.invadersPerLine * (global.invadersSize + global.invadersPadding), global.invadersPerLine);
    const axesHelper = new AxesHelper(global.invadersSize);

    scene.add(gridHelper);
    scene.add(axesHelper);
}

const addControls = (camera, renderer, centerObject) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(centerObject.position);
    return controls;
}

export {
    helpers,
    addControls
}