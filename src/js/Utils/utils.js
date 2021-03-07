import { GridHelper, AxesHelper, Group } from '../../lib/Three.js/build/three.module.js';
import { OrbitControls } from '../../lib/Three.js/examples/jsm/controls/OrbitControls.js';
import { scene } from '../scene.js';

const helperGroup = new Group();
helperGroup.name = 'Les helpers';
scene.add(helperGroup);

// Ajoute les différents helpers
const helpers = (scene, invadersConfig, perLine) => {
    helperGroup.remove(...helperGroup.children);

    const gridHelper = new GridHelper(perLine * (invadersConfig.size + invadersConfig.padding), perLine);
    const axesHelper = new AxesHelper(invadersConfig.size);

    helperGroup.add(gridHelper);
    helperGroup.add(axesHelper);
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