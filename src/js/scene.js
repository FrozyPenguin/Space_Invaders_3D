import * as THREE from '../lib/Three.js/build/three.module.js';
import global from './global.js';

// Création de la scene 3D
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x581845);

// Création du canvas 3D et ajout de celui-ci à la page HTML
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
global.parent.appendChild(renderer.domElement);

// Ajoute une lumière ambiante à la scene
const ambient = new THREE.AmbientLight(0xffffff, 1);
ambient.position.y = 0;
scene.add(ambient);

const light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
scene.add( light );

export {
    scene,
    renderer
}