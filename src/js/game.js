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
import { EventEmitter } from './Utils/eventEmitter.js';
import { Keyboard } from './Mechanics/keyboard.js';
import { takeDamage } from './Mechanics/health.js';
import { Lemniscate } from './Mechanics/lemniscate.js';
import { InterfaceLoader } from './interface/interfaceLoader.js';

const gameEvent = new EventEmitter();

class Game {

    // TODO: Faire le comportement du jeu :
        // - les invaders bougent (à faire dans invaderMovement) - fait
        // - ils peuvent mourir (à faire dans invaders.js) - fait
        // - s'ils touchent le joueur il a perdu (à faire ici) - fait
        // - s'il les tue tous il a gagné (à faire ici) - A faire
        // - les invaders deviennent de plus en plus précis au cours de la partie - A faire
        // (à faire ici)
    //

    // TODO: Mettre en pause si on focus pas la fenetre tester au lancement si possible

    // TODO : Implémenter la manette si j'ai le temps
    // Idée jeu a la manette : https://gamepad-tester.com/for-developers
    // https://samiare.github.io/Controller.js/
    // Idée jeu jojo avec le defender c'est un rageux qui veut exterminer les jojo poses
    // Idée model invaders : https://www.youtube.com/watch?v=Pavv_E2Uss8
    // Idée start : https://www.youtube.com/watch?v=_eL3-6YYWYE
    // Idée fond sonore : https://www.youtube.com/watch?v=2MtOpB5LlUA

    // Déplacer tout les inputs dans une classe keyboard

    /**
     * Constructeur de la class Game
     */
    constructor() {
        // Instances
        this.clock = new THREE.Clock(false);
        this.defender = new Defender(0xff0000, 150);
        this.keyboard = new Keyboard();

        // Clock
        this.delta = 0;

        // Game general
        this.levels = [];
        this.isPaused = false;
        this.drawId = 0;

        // InterfaceLoader
        this.interfaceLoader = new InterfaceLoader();

        // Points
        this.score = 0;

        if(localStorage.getItem('score')) {
            this.bestScore = parseInt(localStorage.getItem('score'));
        }

        // Murs
        this.walls = initWalls();
        scene.add(this.walls);

        // Camera
        this.currentCamera = Cameras.main;

        // Clavier
        this.keyboard.unique();

        // Events
        this.receiveEvent();

        // Projectiles
        this.projectiles = new THREE.Group();
        this.projectiles.name = "Projectiles";
        scene.add(this.projectiles);

        this.addHelpers();
    }

    loadMenu() {

    }

    /**
     * Réinitialise la position de tout les élément de la partie
     */
    resetGame() {
        this.invadersGroup.reset();
        this.defender.reset();
    }

    /**
     * Ajoute les différentes aides visuel à la scene
     */
    addHelpers() {
        helpers(scene);
        this.controls = addControls(this.currentCamera, renderer, this.defender);
    }

    changeCamera(num) {
        let camera = Cameras.changeView(num);
        if(camera) this.currentCamera = camera;
    }

    play() {
        this.clock.start();
        this.toPaused = false;
        this.draw();
    }

    pause() {
        // https://stackoverflow.com/questions/50454680/three-js-pausing-animation-when-not-in-use
        // https://stackoverflow.com/questions/38034787/three-js-and-buttons-for-start-and-pause-animation
        this.clock.stop();
        this.toPaused = true;
        cancelAnimationFrame(this.drawId);
        console.log('pause')
    }

    mute() {
        // Couper la musique
    }

    unMute() {
        // Lancer la musique
    }

    receiveEvent() {
        // Liste d'event
        /**
         * X onInvaderDeath qui prend un invader en param
         * X onPause
         * X onResume
         * X onMute
         * X onUnmute
         * X onStart
         * X onChangeLevel qui prend level + 1
         * X onDefenderMove qui prend la direction (du coup dans defender on aura juste une methode move et c'est plus lui qui gerera le clavier)
         * X onDefenderShoot
         */

        gameEvent.on('onDefenderMove', data => {
            this.defender.move(data.direction, data.delta);
        });

        gameEvent.on('onDefenderShoot', () => {
            this.defender.shoot();
        });

        gameEvent.on('onDefenderDamage', () => {
            if(takeDamage() == 0) {
                this.stopGame();
            }
        })

        gameEvent.on('onInvaderDeath', data => {
            data.death();
            this.score += data.points;

            document.querySelector('#score #actual').innerHTML = this.score;

            // TODO: Regarder combien d'invader il reste pour lancer le prochain niveau
        })

        gameEvent.on('onBonus', data => {
            console.log('Bonus');
            // Position de l'invader a sa mort
            console.log(data.pos);
        })

        gameEvent.on('onPause', () => {
            this.pause();
        })

        gameEvent.on('onResume', () => {
            this.play();
        })

        gameEvent.on('onMute', () => {
            this.mute();
        })

        gameEvent.on('onUnMute', () => {
            this.unMute();
        })

        gameEvent.on('onStart', () => {
            this.startGame();
        })

        gameEvent.on('onStart', () => {
            this.startGame();
        })

        gameEvent.on('onChangeLevel', () => {
            // Afficher écran changement de niveau
            // Passer au niveau suivant
        })

        gameEvent.on('onChangeCamera', data => {
            this.changeCamera(data.code);
        })

        gameEvent.on('onResize', data => {
            renderer.render(scene, this.currentCamera);
        })
    }

    /**
     * Boucle d'animation
     */
    draw() {
        if(this.toPaused) return;

        stats.begin();

        this.delta = this.clock.getDelta();

        if(this.controls) this.controls.update();

        renderer.render(scene, this.currentCamera);
        //this.defender.handleKeyboardLoop(this.delta);

        /*global.updateList.forEach(element => {
            element.update(this.delta);
        });*/

        this.keyboard.loop(this.delta);

        const elementToRemove = scene.remove(scene.getObjectByProperty('toRemove', true));
        if(elementToRemove) scene.remove(elementToRemove);

        // Parcourt les descendant visible de la scène et les met à jour si besoin
        scene.traverseVisible((child) => {
            if(child.update) child.update(this.delta);
        });

        stats.end();

        this.drawId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Démarre une partie
     */
    startGame() {
        // Afficher ecran de jeu
        this.interfaceLoader.load('/src/html/inGameInterface.html')
        .then(() => {
            // Invaders
            this.invadersGroup = initInvaders();
            console.log(this.invadersGroup);

            // Vie
            initHealth(global.lifeCount);

            // TODO: Remplir ce group dans game ou levelManager au lieu de Invader
            // TODO: Déplacer l'ajout à la scene dans le constructeur de game ca sera plus propre
            // Scene
            scene.remove(this.invadersGroup);
            scene.add(this.invadersGroup);

            // Controles
            initDomControls();

            // Collisions
            let defenderCollideGroup = [
                ...this.invadersGroup.children,
                scene.getObjectByName('backWall')
            ];

            this.defender.setCollideGroup(defenderCollideGroup);

            let invaderCollideGroup = [
                this.defender,
                scene.getObjectByName('frontWall')
            ];

            for(let i = 0; i < this.invadersGroup.children.length; i++) {
                this.invadersGroup.children[i].setCollideGroup(invaderCollideGroup);
            }

            this.resetGame();

            this.play();
        })
        .catch(error => console.error(error?.response));
    }

    clearScene() {
        scene.remove(...scene.children);
    }

    stopGame() {
        console.log('fin du jeu');

        this.pause();

        // Mise à jour des scores
        if(this.bestScore < this.score) {
            this.bestScore = this.score;
            localStorage.setItem('score', this.score);
        }

        // Afficher ecran de game over
        this.interfaceLoader.load('/src/html/gameOver.html')
        .then(() => {
            document.querySelector('#overBestScore').innerHTML = this.bestScore;
            document.querySelector('#overScore').innerHTML = this.score;

            document.querySelector('#retry').addEventListener('click', () => {
                this.score = 0;
                this.projectiles.remove(...this.projectiles.children);
                console.log(this.projectiles)
                console.log(scene)
                this.startGame();
            });
        })
        .catch(error => console.error(error?.response));

        // Afficher recap des scores
    }
}

export {
    gameEvent,
    Game
}