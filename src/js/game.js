import * as THREE from '../lib/Three.js/build/three.module.js';
import global from './global.js';
import { initInvaders } from './Characters/invaders.js';
import { Defender } from './Characters/defender.js';
import { initWalls } from './StaticElements/walls.js'
import stats from './Utils/stats.js';
import { scene, renderer } from './scene.js';
import { helpers, addControls } from './Utils/utils.js';
import { initHealth } from './Mechanics/health.js';
import Cameras from './Mechanics/cameras.js';
import { initDomControls } from './domEvent/controls.js';

export class Game {

    // TODO: Faire le comportement du jeu :
        // - les invaders bougent (à faire dans invaderMovement)
        // - ils peuvent mourir (à faire dans invaders.js)
        // - s'ils touchent le joueur il a perdu (à faire ici)
        // - s'il les tue tous il a gagné (à faire ici)
        // - les invaders deviennent de plus en plus précis au cours de la partie
        // (à faire ici)
    //

    // TODO: Réfléchir à comment tout organiser
    // Par event géré par game par exemple

    // TODO: Mettre en pause si on focus pas la fenetre

    // TODO: Faire la fonction pause et resume

    // Idée jeu a la manette : https://gamepad-tester.com/for-developers
    // https://samiare.github.io/Controller.js/
    // Idée jeu jojo avec des le defender c'est un rageux qui veut exterminer les jojo poses
    // Idée model invaders : https://www.youtube.com/watch?v=Pavv_E2Uss8
    // Idée start : https://www.youtube.com/watch?v=_eL3-6YYWYE
    // Idée fond sonore : https://www.youtube.com/watch?v=2MtOpB5LlUA

    /**
     * Constructeur de la class Game
     */
    constructor() {
        this.delta = 0;
        this.clock = new THREE.Clock();
        this.isPaused = false;

        this.invadersGroup = initInvaders();
        this.walls = initWalls();

        initHealth(global.lifeCount);

        scene.add(this.invadersGroup);
        scene.add(this.walls);

        this.defender = new Defender(0xff0000, 150);

        //moveInvaders();
        this.currentCamera = Cameras.main;

        this.addHelpers();
        this.addCameraChanger();
        initDomControls();
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
        this.controls = addControls(this.currentCamera, renderer, this.defender);
    }

    addCameraChanger() {
        document.addEventListener('keydown', (event) => {
            let camera = Cameras.changeView(event.code);
            if(camera) this.currentCamera = camera;
        }, false)
    }

    play() {
        this.isPaused = false;
        this.draw();
    }

    pause() {
        this.isPaused = true;
    }

    /**
     * Boucle d'animation
     */
    draw() {
        stats.begin();

        this.delta = this.clock.getDelta();

        if(this.controls) this.controls.update();

        renderer.render(scene, this.currentCamera);
        this.defender.handleKeyboardLoop(this.delta);

        /*global.updateList.forEach(element => {
            element.update(this.delta);
        });*/

        const elementToRemove = scene.remove(scene.getObjectByProperty('toRemove', true));
        if(elementToRemove) scene.remove(elementToRemove);

        // Parcourt les descendant visible de la scène et les met à jour si besoin
        scene.traverseVisible((child) => {
            if(child.update) child.update(this.delta);
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