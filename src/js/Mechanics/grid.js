import * as THREE from '../../lib/Three.js/build/three.module.js';
import { Invader } from '../Characters/invaders.js';

export class Grid extends THREE.Group {
    constructor(name, invadersConfig, turnBeforeDeath) {
        super();
        this.invadersConfig = invadersConfig;
        this.name = name;
        this.speed = this.invadersConfig.speed;
        this.turnBeforeDeath = turnBeforeDeath;
    }

    /**
     * Réinitialise la position du groupe d'invaders
     */
    reset = () => {
        this.position.x = (this.invadersConfig.size + this.invadersConfig.padding) * Math.floor(this.invadersConfig.perLine / 2);
        this.position.y = 0;
        this.position.z = (this.invadersConfig.size + this.invadersConfig.padding) * Math.floor(this.invadersConfig.perLine / 2);

        this.speed.x = Math.abs(this.speed.x);
    }

    /**
     * Créer l'ensemble des invaders
     */
    createGrid() {
        this.remove(...this.children);

        let lineNumber = 0;
        this.invadersConfig.types.reverse().forEach(type => {
            let nbInvaders = type.lineCount * this.invadersConfig.perLine;
            for(let i = 0; i < nbInvaders; i++) {
                let invader = new Invader(this.invadersConfig.size, this.invadersConfig.shootProb, type);

                if(this.children.length != 0) {
                    if(i  % this.invadersConfig.perLine == 0) {
                        lineNumber++;
                        invader.position.x = this.children[0].position.x;
                        invader.position.z = this.children[lineNumber * this.invadersConfig.perLine - 1].position.z - (this.invadersConfig.size + this.invadersConfig.padding);
                    }
                    else {
                        invader.position.x = this.children[i % this.invadersConfig.perLine + lineNumber * this.invadersConfig.perLine - 1].position.x - (this.invadersConfig.size + this.invadersConfig.padding);
                        invader.position.z = this.children[i % this.invadersConfig.perLine + lineNumber * this.invadersConfig.perLine - 1].position.z;
                    }
                }

                this.add(invader);
            }
        })

        // for (let i = 0; i < this.invadersConfig.count; i++) {
        //     let type = typeInvader[Math.floor(i / this.invadersConfig.perLine)];

        //     let invader = new Invader(this.invadersConfig.size, this.invadersConfig.shootProb, this.projectilesSpeed, this.invadersConfig.types[0]);
        //     //invader.load();

        //     if (i != 0) {
        //         invader.position.x = this.children[i - 1].position.x - (this.invadersConfig.size + this.invadersConfig.padding);
        //         invader.position.z = this.children[i - 1].position.z;

        //         if (i % this.invadersConfig.perLine == 0) {
        //             invader.position.x = this.children[0].position.x;
        //             invader.position.z = this.children[i - 1].position.z - (this.invadersConfig.size + this.invadersConfig.padding);
        //         }
        //     }

        //     // invader.on('kill') => Parcourir invaderGroup -> Si tout active = false alors fin de game niveau suivant
        //     this.add(invader);
        // }
    }


    /**
     * Créer le mouvement des invaders
     */
    update(delta) {
        this.traverseVisible((invader) => {
            if(!(invader instanceof Invader)) return;

            if(invader.isCollidingWall('left')) {
                this.speed.x = this.speed.x > 0 ? this.speed.x * -1 : this.speed.x;

                this.speed.z = -(this.invadersConfig.size + this.invadersConfig.padding) * ((this.children.length / this.invadersConfig.perLine) + this.turnBeforeDeath) / this.turnBeforeDeath;
            }
            else if(invader.isCollidingWall('right')) {
                this.speed.x = this.speed.x < 0 ? this.speed.x * -1 : this.speed.x;
                this.speed.z = -(this.invadersConfig.size + this.invadersConfig.padding) * ((this.children.length / this.invadersConfig.perLine) + this.turnBeforeDeath) / this.turnBeforeDeath;
            }
        })

        this.position.x += delta * this.speed.x;
        this.position.z += this.speed.z;

        this.speed.z = 0;
    }

    getNbInvaders() {
        return this.children.length;
    }
}