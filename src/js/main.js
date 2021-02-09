import * as THREE from '../lib/Three.js/build/three.module.js';
import Stats from '../lib/Stats.js/stats.module.js';
import { helpers, addControls } from './utils.js';
import global from './global.js';
import { initHealth } from './health.js';

// Création de la scene 3D
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x581845);

// Création de la caméra principale
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.y = global.invadersSize*1.5;
camera.position.z = -global.invadersSize * global.nbInvaders;

// Création du canvas 3D et ajout de celui-ci à la page HTML
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
global.parent.appendChild(renderer.domElement);

// Redimensionne le canvas quand la page est redimensionné
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
});

// Ajoute le module de stats
const stats = new Stats();
stats.showPanel(0);
global.parent.appendChild(stats.dom);

// Ajoute une lumière ambiante à la scene
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

// Create the defender object
const defenderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
const defenderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.BackSide });
const defender = new THREE.Mesh(defenderGeometry, defenderMaterial);
scene.add(defender);

helpers(scene);
const controls = addControls(camera, renderer, defender);

initHealth(global.lifeCount);

// Boucle d'animation
const draw = () => {
    stats.begin();

    if(controls) controls.update();
    renderer.render(scene, camera);

    stats.end();

    requestAnimationFrame(draw);
}
draw();
