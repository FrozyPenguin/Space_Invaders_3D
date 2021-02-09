import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';

const typeInvader = [
    {
        type: 'novice',
        color: new THREE.Color(0xffffff),
        point: 10
    },
    {
        type: 'venere',
        color: new THREE.Color(0xff0000),
        point: 20
    },
    {
        type: 'ultraVenere',
        color: new THREE.Color(0x00ffff),
        point: 50
    }
].reverse();

class Invader extends THREE.Mesh {
    constructor(color, type, point) {
        const invaderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
        const invaderMaterial = new THREE.MeshBasicMaterial({ color });
        super(invaderGeometry, invaderMaterial);
        this.name = type;
        this.point = point;

        this.name = 'Invader';
    }

    death() {
        this.active = false;
    }

    live() {
        this.active = true;
    }

    reset() {
        invaderGroup.position.x = (global.invadersSize + global.invadersPadding) * Math.floor(global.invadersPerLine / 2);
        invaderGroup.position.y = 0;
        invaderGroup.position.z = (global.invadersSize + global.invadersPadding) * Math.floor(global.invadersPerLine / 2);
    }

    shoot() {
        let projectile = new Projectile(1, 3 , 1, 0xff00ff, this);
        projectile.setVelocity(-200);
        global.updateList.push(projectile);
    }
}

const invaderGroup = new THREE.Group();

function initInvaders(invadersPositionX, invadersPositionY, invadersPositionZ) {

    // Create invaders objects
    invaderGroup.name = 'Les envahisseurs 2.0';
    // Voir si on lance un reset au lancement de l'application => Si oui c'est useless de redef la position
    invaderGroup.position.x = (global.invadersSize + global.invadersPadding) * Math.floor(global.invadersPerLine / 2);
    invaderGroup.position.z = (global.invadersSize + global.invadersPadding) * Math.floor(global.invadersPerLine / 2);
    invaderGroup.position.y = 0;

    for (let i = 0; i < global.nbInvaders; i++) {
        let type = typeInvader[Math.floor(i/global.invadersPerLine)];
        let invader = new Invader(type.color, type.type, type.point);

        if (i != 0) {
            invader.position.set( invaderGroup.children[i - 1].position.x - (global.invadersSize + global.invadersPadding), 0, invaderGroup.children[i - 1].position.z )

            if (i % global.invadersPerLine == 0) {
                invader.position.set( invaderGroup.children[0].position.x , 0, invaderGroup.children[i - 1].position.z - (global.invadersSize + global.invadersPadding) )
            }
        }

        // invader.on('kill') => Parcourir invaderGroup -> Si tout active = false alors fin de game niveau suivant

        invaderGroup.add(invader);
    }

    invaderGroup.position.y = global.invadersSize / 2 + 0.001;
    return invaderGroup;
}

function moveInvaders() {
    setTimeout(() => {
        invaderGroup.translateX(20);
    }, 300);
}

export {
    initInvaders,
    Invader,
    moveInvaders
}
