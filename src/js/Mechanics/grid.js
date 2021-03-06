import * as THREE from '../../lib/Three.js/build/three.module.js';
import { Invader } from '../Characters/invaders.js';
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

export class Grid extends THREE.Group {
    constructor(name, speed, nbInvaders, type) {
        super();
        this.speed = speed || { x: 50, z: 0 };
        this.length = nbInvaders || global.nbInvaders;
        this.name = name;
        this.type = type;
    }

    /**
     * Réinitialise la position du groupe d'invaders
     */
    reset = () => {
        this.position.x = (global.invadersSize + global.invadersPadding) * Math.floor(global.invadersPerLine / 2);
        this.position.y = /*global.invadersSize / 2 + 0.001*/ 0;
        this.position.z = (global.invadersSize + global.invadersPadding) * Math.floor(global.invadersPerLine / 2);

        this.speed.x = Math.abs(this.speed.x);
    }

    /**
     * Créer l'ensemble des invaders
     */
    createGrid() {
        this.remove(...this.children);

        for (let i = 0; i < this.length; i++) {
            let type = typeInvader[Math.floor(i/global.invadersPerLine)];

            let invader = new Invader(type.color, type.type, type.point, global.projectilesSpeed, this.type[0].models[0]);
            //invader.load();

            if (i != 0) {
                invader.position.x = this.children[i - 1].position.x - (global.invadersSize + global.invadersPadding);
                invader.position.z = this.children[i - 1].position.z;

                if (i % global.invadersPerLine == 0) {
                    invader.position.x = this.children[0].position.x;
                    invader.position.z = this.children[i - 1].position.z - (global.invadersSize + global.invadersPadding);
                }
            }

            // invader.on('kill') => Parcourir invaderGroup -> Si tout active = false alors fin de game niveau suivant
            this.add(invader);
        }
    }


    /**
     * Créer le mouvement des invaders
     */
    update = (delta) => {
        this.traverseVisible((invader) => {
            if(!(invader instanceof Invader)) return;

            if(invader.isCollidingWall('left')) {
                this.speed.x = this.speed.x > 0 ? this.speed.x * -1 : this.speed.x;
                this.speed.z = -(global.invadersSize + global.invadersPadding) * ((global.nbInvaders / global.invadersPerLine) + global.turnBeforeDeath) / global.turnBeforeDeath;
            }
            else if(invader.isCollidingWall('right')) {
                this.speed.x = this.speed.x < 0 ? this.speed.x * -1 : this.speed.x;
                this.speed.z = -(global.invadersSize + global.invadersPadding) * ((global.nbInvaders / global.invadersPerLine) + global.turnBeforeDeath) / global.turnBeforeDeath;
            }
        })

        this.position.x += delta * this.speed.x;
        this.position.z += this.speed.z;

        this.speed.z = 0;
    }
}