import * as THREE from '../lib/Three.js/build/three.module.js';
import global from './global.js';
import { initInvaders } from './Characters/invaders.js';
import { Defender } from './Characters/defender.js';
import { initWalls } from './StaticElements/walls.js'
import stats from './Utils/stats.js';
import { scene, renderer, camera } from './scene.js';
import { helpers, addControls } from './Utils/utils.js';
import { initHealth } from './Mechanics/health.js';

export class Game {

    // TODO : Faire le comportement du jeu :
        // - les invaders bougent (à faire dans invaderMovement)
        // - ils peuvent mourir (à faire dans invaders.js)
        // - s'ils touchent le joueur il a perdu (à faire ici)
        // - s'il les tue tous il a gagné (à faire ici)
        // - les invaders deviennent de plus en plus précis au cours de la partie
        // (à faire ici)
    //

    /**
     * Constructeur de la class Game
     */
    constructor() {
        this.delta = 0;
        this.clock = new THREE.Clock();

        this.invadersGroup = initInvaders();
        this.walls = initWalls();

        initHealth(global.lifeCount);

        scene.add(this.invadersGroup);
        scene.add(this.walls);

        this.defender = new Defender(0xff0000, 150);

        this.addHelpers();
    }

    /**
     * Réinitialise la position de tout les élément de la partie
     */
    resetGame() {
        this.invadersGroup.reset();
    }

    /**
     * Ajoute les différentes aides visuel à la scene
     */
    addHelpers() {
        helpers(scene);
        this.controls = addControls(camera, renderer, this.defender);
    }

    /**
     * Boucle d'animation
     */
    draw() {
        stats.begin();

        this.delta = this.clock.getDelta();

        if(this.controls) this.controls.update();

        renderer.render(scene, camera);
        this.defender.handleKeyboardLoop(this.delta);

        global.updateList.forEach(element => {
            element.update(this.delta);
        });

        stats.end();

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Démarre une partie
     */
    startGame() {

    }
}