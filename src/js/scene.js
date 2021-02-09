import * as THREE from '../lib/Three.js/build/three.module.js';
import global from './global.js';

// Création de la scene 3D
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x581845);

// Création de la caméra principale
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.y = global.invadersSize * 4;
camera.position.z = -(global.invadersSize * 1.5 + global.invadersPadding) * ((global.nbInvaders / global.invadersPerLine) + global.turnBeforeDeath)

// Création du canvas 3D et ajout de celui-ci à la page HTML
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
global.parent.appendChild(renderer.domElement);

// Redimensionne le canvas quand la page est redimensionné
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Ajoute une lumière ambiante à la scene
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

export {
    scene,
    camera,
    renderer
}