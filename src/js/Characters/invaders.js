import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';
import { GameObject } from '../gameObject.js';
import { scene } from '../scene.js';
import { Projectile } from '../Mechanics/projectile.js';
import { takeDamage } from '../Mechanics/health.js';

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
    },
    {
        type: 'ultraVenere',
        color: new THREE.Color(0x00ffff),
        point: 50
    },
    {
        type: 'ultraVenere',
        color: new THREE.Color(0x00ffff),
        point: 50
    }
].reverse();



let directionSpeed = {
    x: 50,
    y: 0,
    z: 0
}

class Invader extends GameObject {

    /**
     * Constructeur d'un Invaders
     * @param { String } color couleur de l'invader
     * @param { typeInvader } type type de l'invader
     * @param { Number } point point distribué lors de l'élimination de l'invader
     */
    constructor(color, type, point) {
        const invaderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
        const invaderMaterial = new THREE.MeshBasicMaterial({ color });
        super(invaderGeometry, invaderMaterial);
        this.name = type;
        this.point = point;

        this.name = 'Invader';
    }

    /**
     * Détruit un invader
     */
    death() {
        // TODO: Ajouter des points
        this.visible = false;

        // TODO: Génération aléatoire de bonus
        // Plus on est au level, moins on a de proba
        let level = 1;
        const bonus = Math.random();
        if(bonus < 0.01 * level) console.log('Bonus');
    }

    /**
     * Ramene à la vie un invader
     */
    live() {
        this.visible = true;
    }

    /**
     * Tire un projectile
     */
    shoot() {
        let collideGroup = [
            scene.getObjectByName('Defender'),
            scene.getObjectByName('frontWall')
        ];

        let projectile = new Projectile(1, 3 , 1, 0xffff00, this, collideGroup);
        projectile.setVelocity(-200);
        //global.updateList.push(projectile);
    }

    isCollidingDefender() {
        let defender = scene.getObjectByName(`Defender`);
        if(defender) {
            let defenderBB = new THREE.Box3().setFromObject(defender);

            return this.getBoundingBox().intersectsBox(defenderBB);
        }
        return false;
    }

    update(delta) {
        const haveToShoot = Math.random();
        if(haveToShoot < global.probToShoot) this.shoot();

        if(this.isCollidingWall('left')) {
            directionSpeed.x = directionSpeed.x > 0 ? directionSpeed.x * -1 : directionSpeed.x;
            directionSpeed.z = -200;
        }
        else if(this.isCollidingWall('right')) {
            directionSpeed.x = directionSpeed.x < 0 ? directionSpeed.x * -1 : directionSpeed.x;
            directionSpeed.z = -200;
        }

        if(this.isCollidingDefender()) {
            if(takeDamage() == 0) {
                directionSpeed = { x: 0, y: 0, z: 0 };
                global.probToShoot = 0;
            };

            // TODO: FIN DU GAME
        }
    }
}

const invaderGroup = new THREE.Group();

/**
 * Réinitialise la position du groupe d'invaders
 */
invaderGroup.reset = () => {
    invaderGroup.position.x = (global.invadersSize + global.invadersPadding) * Math.floor(global.invadersPerLine / 2);
    invaderGroup.position.y = 0;
    invaderGroup.position.z = (global.invadersSize + global.invadersPadding) * Math.floor(global.invadersPerLine / 2);
}

/**
 * Créer l'ensemble des invaders
 */
function initInvaders() {

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


/**
 * Créer le mouvement des invaders
 */
invaderGroup.update = (delta) => {
    invaderGroup.position.x += delta * directionSpeed.x;
    invaderGroup.position.y += delta * directionSpeed.y;
    invaderGroup.position.z += delta * directionSpeed.z;

    directionSpeed.z = 0;
}

export {
    initInvaders,
    Invader,
}
