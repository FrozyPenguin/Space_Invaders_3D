import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';
import { Projectile } from '../Mechanics/projectile.js';
import THREEx from '../../lib/Threex/threex.keyboardstate.js';
import { scene } from '../scene.js';

class Defender extends THREE.Mesh {
    /**
     * Constructeur d'un defender
     * @param { String } color couleur du defender
     * @param { Number } speed vitesse de déplacement du defender
     */
    constructor(color, speed) {
        // Create the defender object
        const defenderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
        const defenderMaterial = new THREE.MeshBasicMaterial({ color });
        super(defenderGeometry, defenderMaterial);
        this.reset();

        this.xSpeed = speed;
        this.intervalId = [];
        this.keyboard = new THREEx.KeyboardState();
        this.handleKeyboardUnique();

        this.name = 'Defender';

        scene.add(this);
    }

    /**
     * Boucle de controle au clavier du defender
     * @param { Number } delta temps écoulé depuis la derniere période d'horloge
     */
    handleKeyboardLoop(delta) {
        if(this.keyboard.pressed('right')) {
            this.position.x -= this.xSpeed * delta;
        }
        else if(this.keyboard.pressed('left')){
            this.position.x += this.xSpeed * delta;
        }
    }

    /**
     * Controle au clavier du defender non répétitif
     */
    handleKeyboardUnique() {
        // handle keydown, return early if event is an autorepeat
        this.keyboard.domElement.addEventListener('keydown', function(event){
            if (event.repeat) {
                return;
            }
            if (this.keyboard.eventMatches(event, 'space') ){
                this.shoot();
            }
        }.bind(this))
    }

    /**
     * Tire un projectile
     */
    shoot() {
        let projectile = new Projectile(1, 3 , 1, 0xff00ff, this);
        projectile.setVelocity(200);
        global.updateList.push(projectile);
    }

    /**
     * Réinitialise la position
     */
    reset() {
        this.position.x = 0;
        this.position.z = -(global.invadersSize + global.invadersPadding) * ((global.nbInvaders / global.invadersPerLine) + global.turnBeforeDeath);
        this.position.y = global.invadersSize / 2 + 0.001;
    }
}

export {
    Defender
}