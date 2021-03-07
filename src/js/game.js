import * as THREE from '../lib/Three.js/build/three.module.js';
import global from './global.js';
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
import { InterfaceLoader } from './interface/interfaceLoader.js';
import { LevelManager } from './levels/levelManager.js';
import { Grid } from './placements/grid.js';
import { ShieldManager } from './Mechanics/shieldManager.js';
import { CustomPlacement } from './placements/custom.js';

const gameEvent = new EventEmitter();

class Game {

    // TODO: Faire le comportement du jeu :
        // - les invaders bougent (à faire dans invaderMovement) - fait
        // - ils peuvent mourir (à faire dans invaders.js) - fait
        // - s'ils touchent le joueur il a perdu (à faire ici) - fait
        // - s'il les tue tous il a gagné (à faire ici) - Fait
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
        this.keyboard = new Keyboard();
        this.level = new LevelManager();

        // Clock
        this.delta = 0;

        // Game general
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
        // this.walls = initWalls();
        // scene.add(this.walls);

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

        // Invaders
        // this.invadersGroup = new Grid('Les envahisseurs 2.0');
        // scene.add(this.invadersGroup);

        const listener = new THREE.AudioListener();
        this.currentCamera.add(listener);

        // create a global audio source
        this.sound = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('/src/medias/sounds/laMusique.mp3', buffer => {
            this.sound.setBuffer(buffer);
            this.sound.setLoop(true);
            this.sound.setVolume(0.5);
            // TODO: Enlever ca d'ici pour le mettre sur le start game
            this.sound.play();
        });
    }

    loadMenu() {

    }

    /**
     * Réinitialise la position de tout les élément de la partie
     */
    resetGame() {
        this.defender.reset();
        this.invadersGroup.reset();
    }

    /**
     * Ajoute les différentes aides visuel à la scene
     */
    addHelpers(invadersConfig) {
        helpers(scene, invadersConfig, this.invadersGroup.getPerLine());
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
        // TODO: Mettre a jour l'interface au niveau du son principalement
        if(/*!this.sound.userMuted && */this.sound.buffer) this.unMute();
    }

    pause() {
        // https://stackoverflow.com/questions/50454680/three-js-pausing-animation-when-not-in-use
        // https://stackoverflow.com/questions/38034787/three-js-and-buttons-for-start-and-pause-animation
        this.clock.stop();
        this.toPaused = true;
        cancelAnimationFrame(this.drawId);
        console.log('pause')
        this.mute();
    }

    mute() {
        // Couper la musique
        this.sound.pause();
    }

    unMute() {
        console.log("oui")
        // Lancer la musique
        this.sound.play();
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
                this.stopGame(false);
            }
        });

        gameEvent.on('onInvaderDeath', data => {
            if(data.death()) {
                this.score += data.points;

                document.querySelector('#score #actual').innerHTML = this.score;

                const taille = this.invadersGroup.children.length;
                for(let i = 0; i < taille; i++) {
                    if(this.invadersGroup.children[i].visible) return;
                }

                this.changeLevel();
            }
        });

        gameEvent.on('onBonus', data => {
            console.log('Bonus');
            // Position de l'invader a sa mort
            console.log(data.pos);
        });

        gameEvent.on('onPause', () => {
            this.pause();
        });

        gameEvent.on('onResume', () => {
            this.play();
        });

        gameEvent.on('onMute', () => {
            this.mute();
        });

        gameEvent.on('onUnMute', () => {
            this.unMute();
        });

        gameEvent.on('onStart', () => {
            this.startGame();
        });

        gameEvent.on('onStart', () => {
            this.startGame();
        });

        gameEvent.on('onChangeCamera', data => {
            this.changeCamera(data.code);
        });

        gameEvent.on('onResize', data => {
            renderer.render(scene, this.currentCamera);
        });

        gameEvent.on('onShieldDamage', data => {
            data.takeDamage();
        });
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
        this.level.current = 0;

        // Afficher ecran de jeu
        this.interfaceLoader.load('/src/html/inGameInterface.html')
        .then(() => {
            this.changeLevel()
            .then(() => {
                // Vie
                initHealth(global.lifeCount);

                // Controles
                initDomControls();

                this.play();
            });
        })
        .catch(error => console.error(error?.response ?? error));
    }

    clearScene() {
        scene.remove(...scene.children);
    }

    parseLevelFile(file) {
        this.invadersGroup?.remove?.(...this.invadersGroup.children);
        scene.remove(this.invadersGroup);
        scene.remove(this.walls);
        scene.remove(this.shields);

        if(!this.defender) {
            this.defender = new Defender(file.defender);
        }

        this.defender.setShootDelay(file.defender.shotDelay);

        // Creation des invaders du niveau actuel
        if(file.invaders.placement == "grid") {
            this.invadersGroup = new Grid(`Les Envahisseurs du level ${file.id}`, file.invaders, file.turnBeforeDeath);
            this.invadersGroup.createGrid();
        }
        else if(file.invaders.placement == "custom") {
            this.invadersGroup = new CustomPlacement(`Les Envahisseurs du level ${file.id}`, file.invaders, file.turnBeforeDeath);
            this.invadersGroup.createGrid();
        }
        else throw 'Configuration de placement invalide ou inexistante !';

        this.defender.setZPosition(-(file.invaders.size + file.invaders.padding) * ((this.invadersGroup.getNbInvaders() / this.invadersGroup.getPerLine()) + file.turnBeforeDeath));

        // Helpers
        this.addHelpers(file.invaders);

        // Ajustement de la taille de la zone de jeu
        this.walls = initWalls(this.invadersGroup.getNbInvaders(), file.invaders.size, file.invaders.padding, this.invadersGroup.getPerLine(), file.turnBeforeDeath);

        // Shields
        this.shields = new ShieldManager("Shields", file.shields, this.defender.position.z + file.defender.height * 2);
        this.shields.createShield();

        scene.add(this.invadersGroup);
        scene.add(this.walls);
        scene.add(this.shields);
    }

    changeLevel() {
        return new Promise((resolve, reject) => {
            this.level.nextLevel()
            .then(level => {
                // Afficher interface changement de niveau avec le niveau
                // Creer les objets

                if (level.status == 404 && level != 200) {
                    this.stopGame(true);
                }

                if(level.ok) {
                    level.json()
                    .then(json => {
                        this.parseLevelFile(json);

                        // Collisions
                        let defenderCollideGroup = [
                            ...this.invadersGroup.children,
                            scene.getObjectByName('backWall'),
                            ...this.shields.children
                        ];

                        this.defender.setCollideGroup(defenderCollideGroup);

                        let invaderCollideGroup = [
                            this.defender,
                            scene.getObjectByName('frontWall'),
                            ...this.shields.children
                        ];

                        for(let i = 0; i < this.invadersGroup.children.length; i++) {
                            this.invadersGroup.children[i].setCollideGroup(invaderCollideGroup);
                        }

                        this.resetGame();

                        resolve();
                    })
                }

            })
            .catch(error => {
                console.error(error);
                reject(error);
            })
        })
    }

    stopGame(win) {
        console.log('fin du jeu');

        this.pause();

        // Mise à jour des scores
        if(this.bestScore < this.score) {
            this.bestScore = this.score;
            localStorage.setItem('score', this.score);
        }

        if(!win) {
            // Afficher ecran de game over
            this.interfaceLoader.load('/src/html/gameOver.html')
            .then(() => {
                document.querySelector('#overBestScore').innerHTML = this.bestScore;
                document.querySelector('#overScore').innerHTML = this.score;

                document.querySelector('#retry').addEventListener('click', () => {
                    this.score = 0;
                    this.projectiles.remove(...this.projectiles.children);
                    this.startGame();
                });
            })
            .catch(error => console.error(error?.response));
        }
        else {
            // Afficher ecran de win
            this.interfaceLoader.load('/src/html/win.html')
            .then(() => {
                document.querySelector('#winBestScore').innerHTML = this.bestScore;
                document.querySelector('#winScore').innerHTML = this.score;

                document.querySelector('#retry').addEventListener('click', () => {
                    this.score = 0;
                    this.projectiles.remove(...this.projectiles.children);
                    this.startGame();
                });
            })
            .catch(error => console.error(error?.response));
        }

        // Afficher recap des scores
    }
}

export {
    gameEvent,
    Game
}