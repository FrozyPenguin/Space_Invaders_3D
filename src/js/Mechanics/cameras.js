import { PerspectiveCamera, Vector3 } from '../../lib/Three.js/build/three.module.js';
import { scene } from '../scene.js';
import { OrbitControls } from '../../lib/Three.js/examples/jsm/controls/OrbitControls.js';

class GameCamera extends PerspectiveCamera {
    constructor(renderer) {
        super(80, window.innerWidth / window.innerHeight, 1, 1800);

        this.invadersConfig = {};

        this.viewsArray = [];

        this.actualView = 1;

        this.controls = null;
        this.renderer = renderer;

        this.changeView(1);
        this.lookCenter();

        this.toUpdate = false;
    }

    lookCenter() {
        let target = new Vector3(0, 0, -(this.invadersConfig.size + this.invadersConfig.padding) * ((this.invadersConfig.nbInvaders / this.invadersConfig.perLine) + this.invadersConfig.turnBeforeDeath) / 2);
        this.lookAt(target);

        let rotation = this.viewsArray[this.actualView - 1]?.rotation;
        this.rotation.x += rotation?.x;
        this.rotation.y += rotation?.y;
        this.rotation.z += rotation?.z;

        if(this.controls) {
            this.controls.target.set(target.x, target.y, target.z);
            this.controls.update();
        }
    }

    changeView(code) {
        if(code > this.viewsArray.length || code <= 0) return;

        const view = this.viewsArray[code - 1]

        let position = view.position;
        if(!(position instanceof Vector3)) {
            position = new Vector3().copy(scene.getObjectByName(position).position);
        }

        this.position.copy(position);

        this.actualView = code;

        this.controls?.update();

        this.toUpdate = view.toUpdate ? true : false;

        this.lookCenter();
    }

    setInvadersConfig(padding, size, nbInvaders, perLine, turnBeforeDeath) {
        this.invadersConfig = {
            padding,
            size,
            nbInvaders,
            perLine,
            turnBeforeDeath
        };

        this.viewsArray = [
            {
                position: new Vector3(
                    0,
                    (this.invadersConfig.size + this.invadersConfig.padding) * ((this.invadersConfig.nbInvaders / this.invadersConfig.perLine) + this.invadersConfig.turnBeforeDeath) * 1.5,
                    -(this.invadersConfig.size + this.invadersConfig.padding) * ((this.invadersConfig.nbInvaders / this.invadersConfig.perLine) + this.invadersConfig.turnBeforeDeath) / 2
                ),
                rotation: new Vector3(0, 0, Math.PI)
            },
            {
                position: 'Defender',
                rotation: new Vector3(0, 0, 0),
                toUpdate: true
            },
            {
                position: new Vector3(
                        0,
                        this.invadersConfig.size * 5,
                        -(this.invadersConfig.size * 1.5 + this.invadersConfig.padding) * ((this.invadersConfig.nbInvaders / this.invadersConfig.perLine) + this.invadersConfig.turnBeforeDeath)
                ),
                rotation: new Vector3(0, 0, 0)
            },
            {
                position: new Vector3(
                        -(this.invadersConfig.size + this.invadersConfig.padding) * ((this.invadersConfig.nbInvaders / this.invadersConfig.perLine) + this.invadersConfig.turnBeforeDeath) * 1.5,
                        ((this.invadersConfig.size + this.invadersConfig.padding) * ((this.invadersConfig.nbInvaders / this.invadersConfig.perLine) + this.invadersConfig.turnBeforeDeath) * 1.5) / 2,
                        -(this.invadersConfig.size + this.invadersConfig.padding) * ((this.invadersConfig.nbInvaders / this.invadersConfig.perLine) + this.invadersConfig.turnBeforeDeath) / 2
                ),
                rotation: new Vector3(0, 0, 0)
            }
        ];

        this.changeView(this.actualView);
    }

    addControls() {
        if(this.controls) return;
        this.controls = new OrbitControls(this, this.renderer.domElement);
    }

    update(delta) {
        if(this.controls) this.controls.update();

        if(this.toUpdate) {
            let position = this.viewsArray[this.actualView - 1].position;
            if(!(position instanceof Vector3)) {
                position = new Vector3().copy(scene.getObjectByName(position).position);
                position.z = position.z + 5;
            }

            this.position.copy(position);
            this.lookAt(position.x, position.y, position.z + 20);
        }
    }
}

export {
    GameCamera
}