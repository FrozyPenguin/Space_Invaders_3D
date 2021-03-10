import * as THREE from '../lib/Three.js/build/three.module.js';
import global from './global.js';
import { Defender } from './Characters/defender.js';
import { initWalls } from './StaticElements/walls.js'
import stats from './Utils/stats.js';
import { scene, renderer } from './scene.js';
import { helpers } from './Utils/utils.js';
import { giveHealth, initHealth, takeDamage } from './Mechanics/health.js';
import { GameCamera } from './Mechanics/cameras.js';
import { initDomControls, play, pause, mute, unMute, userMuted, userPaused } from './domEvent/controls.js';
import { EventEmitter } from './Utils/eventEmitter.js';
import { Keyboard } from './Mechanics/keyboard.js';
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
        this.isStop = false;
        this.drawId = 0;

        // InterfaceLoader
        this.interfaceLoader = new InterfaceLoader();

        // Points
        this.score = 0;

        if(localStorage.getItem('score')) {
            this.bestScore = parseInt(localStorage.getItem('score'));
        }
        else this.bestScore = 0;

        // Murs
        // this.walls = initWalls();
        // scene.add(this.walls);

        // Camera
        this.currentCamera = new GameCamera(renderer);
        //this.currentCamera.addControls();

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

        // TODO: sound design
        // Chargement de la musique et des effets sonores
        const listener = new THREE.AudioListener();
        //this.currentCamera.add(listener);

        // create a global audio source
        this.music = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('/src/medias/sounds/laMusique.mp3', buffer => {
            this.music.setBuffer(buffer);
            this.music.setLoop(true);
            this.music.setVolume(0.5);
        });

        // Chargement des interfaces
        this.interfaces = {};
        this.loadInterfaces();
        this.levelsNumber = 0;

        // Mode invincible
        this.godMode = false;
    }

    async loadInterfaces() {
        let promises = [];
        promises.push(this.interfaceLoader.load('/src/html/inGameInterface.html'));
        promises.push(this.interfaceLoader.load('/src/html/changeLevel.html'));
        promises.push(this.interfaceLoader.load('/src/html/gameOver.html'));
        promises.push(this.interfaceLoader.load('/src/html/menu.html'));
        promises.push(this.interfaceLoader.load('/src/html/win.html'));

        Promise.all(promises)
        .then(interfaces => {
            setTimeout(() => {
                document.querySelector('#loader').parentElement.style.display = "none";

                this.interfaces.inGame = interfaces[0];
                this.interfaces.changeLevel = interfaces[1];
                this.interfaces.gameOver = interfaces[2];
                this.interfaces.menu = interfaces[3];
                this.interfaces.win = interfaces[4];

                // Ajoute les évenement dom des différentes interfaces
                initDomControls();

                // Afficher menu
                this.displayMenuInterface();
                // this.startGame();
            }, 1000)
        })
        .catch(error => {
            throw error?.response ?? error;
        })
    }

    async displayMenuInterface() {
        const levelManager = new LevelManager();
        const recapPoints = document.querySelector('#recapPoints');
        let levelJson = null;

        do {
            levelJson = await levelManager.nextLevel();
            if(levelJson.ok) {
                this.levelsNumber++;
                let level = await levelJson.json();

                console.log(level.invaders)
                // Injection dans tableau #recapPoints
                let textHtml = `<table><thead><tr><th colspan="2">Niveau ${level.id}<br>${level.name}</th></tr></thead><tbody>`;
                level.invaders.types.forEach(invadersType => {
                    let iconeHtml = '';
                    if(invadersType.icon) {
                        iconeHtml = `<img src="${invadersType.icon}" alt="icone invader ${invadersType.name}">`;
                    }

                    textHtml += `<tr><td>${iconeHtml} ${invadersType.name}</td><td>${invadersType.points}pts</td></tr>`;
                });
                textHtml += `</tbody></table>`
                recapPoints.innerHTML += textHtml;
            }
        }
        while(levelJson.ok)

        this.displayBestScore();
        this.interfaceLoader.show(this.interfaces.menu);
    }

    displayBestScore() {
        let bestScoreElement = document.querySelector('#bestScore');
        bestScoreElement.innerHTML = '';
        if(this.bestScore) {
            bestScoreElement.innerHTML = `Meilleur score : ${this.bestScore}`;
        }
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
        //this.controls = addControls(this.currentCamera, renderer, this.defender);
    }

    changeCamera(num) {
        /*let camera = */this.currentCamera.changeView(num);
        //if(camera) this.currentCamera = camera;
    }

    play() {

        // Lance la musique seulement si l'utilisateur n'a pas mute
        if(!userMuted && this.music.buffer) unMute();

        // this.toPaused = false;
        // this.draw();

        this.clock.stop();

        setTimeout(() => {
            // Attente avant de lancer le niveau pour laisser le temps d'observer la configuration et de se préparer
            if(!userPaused) this.clock.start();

            // Si quand on lance on a perdu le focus de la fenetre alors on met en pause
            if(!document.hasFocus()) pause();
        }, 1000);
    }

    pause(changeLevel) {
        // https://stackoverflow.com/questions/50454680/three-js-pausing-animation-when-not-in-use
        // https://stackoverflow.com/questions/38034787/three-js-and-buttons-for-start-and-pause-animation
        this.clock.stop();
        // this.toPaused = true;
        // cancelAnimationFrame(this.drawId);
        console.log('pause')
        if(!changeLevel) mute();
    }

    mute() {
        // Couper la musique
        this.music.pause();
    }

    unMute() {
        console.log("oui")
        // Lancer la musique
        if(!this.music.isPlaying) this.music.play();
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
            // Ne peut tirer que si l'horloge tourne et que donc le jeu n'est pas en pause
            if(!this.clock.running) return;
            this.defender.shoot();
        });

        gameEvent.on('onDefenderDamage', () => {
            if(this.godMode) return;
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

                pause(null, true);

                this.changeLevel()
                .then(() => {
                    play();
                    giveHealth();
                })
                .catch(error => {
                    throw error;
                });
            }
        });

        gameEvent.on('onBonus', data => {
            console.log('Bonus');
            // Position de l'invader a sa mort
            console.log(data.pos);
        });

        gameEvent.on('onPause', levelChange => {
            this.pause(levelChange);
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

        gameEvent.on('onChangeCamera', data => {
            this.changeCamera(data.code);
        });

        gameEvent.on('onResize', data => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            this.currentCamera.aspect = window.innerWidth / window.innerHeight;
            this.currentCamera.updateProjectionMatrix();
            renderer.render(scene, this.currentCamera);
        });

        gameEvent.on('onShieldDamage', data => {
            data.takeDamage();
        });

        gameEvent.on('onRetry', () => {
            this.score = 0;
            this.startGame();
        })

        gameEvent.on('onStartGame', () => {
            this.startGame();
        })

        gameEvent.on('onEndGame', () => {
            this.stopGame();
        })

        gameEvent.on('onMenu', () => {
            this.displayBestScore();
            this.interfaceLoader.show(this.interfaces.menu);
        })

        gameEvent.on('onToggleGodMode', () => {
            this.godMode = !this.godMode;
        })

        gameEvent.on('onKillAll', () => {
            pause(null, true);

            this.changeLevel()
            .then(() => {
                play();
                giveHealth();
            })
            .catch(error => {
                throw error;
            });
        })
    }

    /**
     * Boucle d'animation
     */
    draw() {
        if(this.toStop) return;

        stats.begin();

        this.delta = this.clock.getDelta();

        this.currentCamera.update(this.delta);

        renderer.render(scene, this.currentCamera);
        //this.defender.handleKeyboardLoop(this.delta);

        /*global.updateList.forEach(element => {
            element.update(this.delta);
        });*/

        // Met à jour les élements seulement si l'horloge est en route
        // Cette façon de faire offre la possibilité de laisser le stat tourner ainsi que orbit controls
        // par contre l'inconvénient c'est que la boucle d'animation continu de tourner
        if(this.clock.running) {
            this.keyboard.loop(this.delta);

            const elementToRemove = scene.remove(scene.getObjectByProperty('toRemove', true));
            if(elementToRemove) scene.remove(elementToRemove);

            // Parcourt les descendant visible de la scène et les met à jour si besoin
            scene.traverseVisible((child) => {
                if(child.update) child.update(this.delta);
            });
        }

        stats.end();

        this.drawId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Démarre une partie
     */
    startGame() {
        this.level.resetLevel();

        this.changeLevel()
        .then(() => {
            // Reinitialise la vie
            initHealth(global.lifeCount);

            this.toStop = false;
            this.draw();

            // Lance la boucle d'animation
            play();
        });

    }

    clearScene() {
        scene.remove(...scene.children);
    }

    parseLevelFile(file) {

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

        // Cameras
        this.currentCamera.setInvadersConfig(file.invaders.padding, file.invaders.size, this.invadersGroup.getNbInvaders(), this.invadersGroup.getPerLine(), file.turnBeforeDeath)

        scene.add(this.invadersGroup);
        scene.add(this.walls);
        scene.add(this.shields);
    }

    changeLevel() {
        return new Promise((resolve, reject) => {
            this.level.nextLevel(this.levelsNumber)
            .then(level => {
                if (level.status == 404 && level != 200) {
                    this.stopGame(true);
                }

                if(level.ok) {
                    level.json()
                    .then(json => {
                        this.invadersGroup?.remove?.(...this.invadersGroup.children);
                        this.projectiles.remove(...this.projectiles.children);
                        scene.remove(this.invadersGroup);
                        scene.remove(this.walls);
                        scene.remove(this.shields);

                        // Affiche l'interface de changement de niveau
                        this.interfaceLoader.show(this.interfaces.changeLevel);
                        document.querySelector('#idLevel').innerHTML = json.id;
                        document.querySelector('#levelName').innerHTML = json.name;

                        // Ajoute les éléments nécessaire au niveau
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

                        setTimeout(() => {
                            // Afficher ecran de jeu
                            this.interfaceLoader.show(this.interfaces.inGame);
                            resolve();
                        }, 1500);
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

        // Met en pause et donc arrête l'horloge
        pause();
        this.music.stop();
        this.toStop = true;
        cancelAnimationFrame(this.drawId);

        // Arrete la boucle d'animation

        // Mise à jour des scores
        if(this.bestScore < this.score) {
            this.bestScore = this.score;
            localStorage.setItem('score', this.score);
        }

        if(!win) {
            document.querySelector('#overBestScore').innerHTML = this.bestScore;
            document.querySelector('#overScore').innerHTML = this.score;

            // Afficher ecran de game over
            this.interfaceLoader.show(this.interfaces.gameOver);
        }
        else {
            document.querySelector('#winBestScore').innerHTML = this.bestScore;
            document.querySelector('#winScore').innerHTML = this.score;

            // Afficher ecran de win
            this.interfaceLoader.show(this.interfaces.win);
        }

        // Afficher recap des scores
    }
}

export {
    gameEvent,
    Game
}