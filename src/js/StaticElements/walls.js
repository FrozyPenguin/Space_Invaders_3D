import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';
import { GameObject } from './gameObject.js';

class Wall extends GameObject {
    /**
     * Créer un mur
     * @param { Number } width largeur du mur
     * @param { Number } height hauteur du mur
     * @param { object } pos position x et z du mur
     * @param { object } rot rotation x,y,z du mur en degré
     * @param { String } color couleur du mur
     */
    constructor(name, width, height, pos, rot, color = 0x000000) {
        // const invaderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
        // const invaderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.BackSide });

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide });
        super(geometry, material);

        rot.x = THREE.Math.degToRad(rot.x);
        rot.y = THREE.Math.degToRad(rot.y);
        rot.z = THREE.Math.degToRad(rot.z);
        this.rotation.set(rot.x, rot.y, rot.z);

        this.position.set(pos.x, pos.y, pos.z);

        this.name = name;
    }
}

/**
 * Ajoute les limites du terrain à la scène
 */
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

    //let size = (global.invadersPerLine + Math.floor(global.invadersPerLine / 2)) * (global.invadersSize + global.invadersPadding) * 1.5;
    let size = (global.invadersSize + global.invadersPadding) * ((global.nbInvaders / global.invadersPerLine) + global.turnBeforeDeath) * 1.5;
    let offset = size / 2; // + Taile du bos TODO:

    // Bas
    planeGroup.add(new Wall('bottomWall', size, size, {x: 0, y: 0, z: -offset/2}, {x: 90, y: 0, z: 0}));

    // Haut
    planeGroup.add(new Wall('topWall', size, size, {x: 0, y: size, z: -offset/2}, {x: -90, y: 0, z: 0}));

    // Gauche
    planeGroup.add(new Wall('leftWall', size, size, {x: offset, y: offset, z: -offset/2}, {x: 0, y: 90, z: 0}, 0x222222));

    // Droite
    planeGroup.add(new Wall('rightWall', size, size, {x: -offset, y: offset, z: -offset/2}, {x: 0, y: -90, z: 0}, 0x222222));

    // Derriere
    planeGroup.add(new Wall('backWall', size, size, {x: 0, y: offset, z: offset/2}, {x: 0, y: 0, z: 0}));

    // Devant
    planeGroup.add(new Wall('frontWall', size, size, {x: 0, y: offset, z: -size*0.75}, {x: 0, y: 180, z: 0}));

    return planeGroup;
}

export {
    initWalls,
    Wall
}