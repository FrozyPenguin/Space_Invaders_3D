import * as THREE from '../../lib/Three.js/build/three.module.js';
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
function initWalls(nbCharacters, characterSize, characterPadding, characterPerLine, turnBeforeDeath) {

    const planeGroup = new THREE.Group();
    planeGroup.name = 'Les murs';

    let size = (characterSize + characterPadding) * ((nbCharacters / characterPerLine) + turnBeforeDeath) * 1.5;
    let offset = size / 2;

    // Bas
    let bottomWall = new Wall('bottomWall', size, size, {x: 0, y: 5, z: -offset/2}, {x: 0, y: 0, z: 0});
    bottomWall.remove(...bottomWall.children)
    bottomWall.loadModel({
        src: "/src/medias/models/terrain/Super_Training_Stage.obj",
        mtl: "/src/medias/models/terrain/Super_Training_Stage.mtl",
        scale: {
            x: size/5,
            y: size/5,
            z: size/5
        }
    })
    .then(() => {
        let addedModel = bottomWall.children[0];
        addedModel.children.splice(addedModel.children.findIndex(element => element.name == 'flag_3_flag_3_spa_prop00.png'), 1);
    });
    planeGroup.add(bottomWall);

    // Gauche
    planeGroup.add(new Wall('leftWall', size, size, {x: offset, y: offset, z: -offset/2}, {x: 0, y: 90, z: 0}, 0x222222));

    // Droite
    planeGroup.add(new Wall('rightWall', size, size, {x: -offset, y: offset, z: -offset/2}, {x: 0, y: -90, z: 0}, 0x222222));

    // Derriere
    planeGroup.add(new Wall('backWall', size, size, {x: 0, y: offset, z: offset/2}, {x: 0, y: 0, z: 0}));

    // Devant
    planeGroup.add(new Wall('frontWall', size, size, {x: 0, y: offset, z: -size*0.75}, {x: 0, y: 180, z: 0}));

    planeGroup.children.forEach((child, index) => {
        let mesh = child.children[0];
        if(mesh instanceof THREE.Mesh) {
            mesh.material.opacity = 0;
            mesh.material.transparent = true;
        };
    })

    return planeGroup;
}

export {
    initWalls,
    Wall
}