import { GridHelper, AxesHelper } from '../../lib/Three.js/build/three.module.js';
import { OrbitControls } from '../../lib/Three.js/examples/jsm/controls/OrbitControls.js';

// Ajoute les différents helpers
const helpers = (scene, invadersConfig) => {
    const gridHelper = new GridHelper(invadersConfig.perLine * (invadersConfig.size + invadersConfig.padding), invadersConfig.perLine);
    const axesHelper = new AxesHelper(invadersConfig.size);

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