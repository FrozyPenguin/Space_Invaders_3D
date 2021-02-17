import * as THREE from '../lib/Three.js/build/three.module.js';
import { gameEvent } from './game.js';
import global from './global.js';
import cameras from './Mechanics/cameras.js';

// Création de la scene 3D
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x581845);

// Création du canvas 3D et ajout de celui-ci à la page HTML
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
global.parent.appendChild(renderer.domElement);

// Redimensionne le canvas quand la page est redimensionné
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    for(let [index, camera] of Object.entries(cameras)) {
        if(typeof camera === 'function') return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        gameEvent.emit('onResize');
    }
});

// Ajoute une lumière ambiante à la scene
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

export {
    scene,
    renderer
}