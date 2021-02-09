import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';

/**
 * Ajoute les limites du terrain
 * @param { Number } width largeur du mur
 * @param { Number } height hauteur du mur
 * @param { object } pos position x et z du mur
 * @param { object } rot rotation x,y,z du mur en degré
 */
function addWall(width, height, pos, rot) {
    // const invaderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
    // const invaderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.BackSide });

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
    const plane = new THREE.Mesh(geometry, material);

    rot.x = THREE.Math.degToRad(rot.x);
    rot.y = THREE.Math.degToRad(rot.y);
    rot.z = THREE.Math.degToRad(rot.z);
    plane.rotation.set(rot.x, rot.y, rot.z);

    plane.position.set(pos.x, pos.y, pos.z);

    return plane;
}

function initWalls() {

    const planeGroup = new THREE.Group();
    planeGroup.name = 'Les murs';

    // let nbWalls = 6;
    // for(let i = 0; i < nbWalls; i++) {
    //     /**
    //      * Taille du mur modifiable en fonction de :
    //      *      - la taille d'un invader
    //      *      - la position du mur (Haut, gauche, devant, derriere, droite, bas)
    //      */
    //     planeGroup.add(addWall(global.widthWall, h, p, r));
    // }

    let size = (global.invadersPerLine + Math.floor(global.invadersPerLine / 2)) * (global.invadersSize + global.invadersPadding) * 1.5;
    let offset = size / 2;

    // Bas
    planeGroup.add(addWall(size, size, {x: 0, y: 0, z: 0}, {x: 90, y: 0, z: 0}));

    // Haut
    planeGroup.add(addWall(size, size, {x: 0, y: size, z: 0}, {x: -90, y: 0, z: 0}));

    // Droite
    planeGroup.add(addWall(size, size, {x: offset, y: offset, z: 0}, {x: 0, y: 90, z: 0}));

    // Gauche
    planeGroup.add(addWall(size, size, {x: -offset, y: offset, z: 0}, {x: 0, y: -90, z: 0}));

    // Derriere
    planeGroup.add(addWall(size, size, {x: 0, y: offset, z: offset}, {x: 0, y: 0, z: 0}));

    // Devant
    planeGroup.add(addWall(size, size, {x: 0, y: offset, z: -offset}, {x: 0, y: 180, z: 0}));

    return planeGroup;
}

export {
    initWalls
}