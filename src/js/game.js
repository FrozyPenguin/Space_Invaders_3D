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
import { Bernoulli, Gerono } from './Utils/lemniscate.js';
import { Flow, InstancedFlow } from '../lib/Three.js/examples/jsm/modifiers/CurveModifier.js';

const gameEvent = new EventEmitter();

class Game {

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
        this.clock = new THREE.Clock();
        this.defender = new Defender(0xff0000, 150);
        this.keyboard = new Keyboard();

        // Clock
        this.delta = 0;

        // Game general
        this.levels = [];
        this.isPaused = false;
        this.drawId = 0;
        this.actLvl = 1;

        // Invaders
        this.invadersGroup = initInvaders();
        this.walls = initWalls();

        // Vie
        initHealth(global.lifeCount);

        // Scene
        scene.add(this.invadersGroup);
        scene.add(this.walls);
        this.currentCamera = Cameras.main;

        this.addHelpers();

        // Controles
        initDomControls();
        this.keyboard.unique();

        // Events
        this.receiveEvent();

        // Points
        this.score = 0;
        this.bestScore = 0;

        if(localStorage.getItem('score')) {
            this.bestScore = parseInt(localStorage.getItem('score'));
        }

        this.obj = this.test()
    }


    loadLevel() {
        this.levels[this.actLvl];
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

    changeCamera(num) {
        let camera = Cameras.changeView(num);
        if(camera) this.currentCamera = camera;
    }

    play() {
        this.clock.start();
        this.draw();
    }

    pause() {
        // https://stackoverflow.com/questions/50454680/three-js-pausing-animation-when-not-in-use
        // https://stackoverflow.com/questions/38034787/three-js-and-buttons-for-start-and-pause-animation
        this.clock.stop();
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
            this.actLvl++;
            this.loadLevel();
        })

        gameEvent.on('onChangeCamera', data => {
            this.changeCamera(data.code);
        })

        gameEvent.on('onResize', data => {
            renderer.render(scene, this.currentCamera);
        })
    }

    test() {
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_modifier_curve_instanced.html
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_modifier_curve.html

        // TODO: Déplacer toute cette logique dans un endroit adéquat

        // Dessine la lemniscate
        let scale = global.invadersPerLine*(global.invadersPadding+global.invadersSize);
        let nbPoints = global.nbInvaders;
        let pointsBernoulli = Bernoulli(scale, nbPoints);

        pointsBernoulli = pointsBernoulli.map(point => new THREE.Vector3( point.x, 10, point.y ));

        const cubes = new THREE.Group();
        cubes.name = 'Les Envahisseurs du 8 perdu !';
        const flows = [];

        const curve = new THREE.CatmullRomCurve3(pointsBernoulli);
        curve.curveType = "centripetal";
        curve.closed = true;

        const line = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints( pointsBernoulli ),
            new THREE.LineBasicMaterial( { color: 0x00ff00 } )
        );
        // scene.add(line)

        for(let i = 0; i < pointsBernoulli.length; i++) {
            const invaderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
            const invaderMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
            const cube = new THREE.Mesh(invaderGeometry, invaderMaterial);

            // cube.position.x = pointsBernoulli[i].x
            // cube.position.y = pointsBernoulli[i].y
            // cube.position.z = pointsBernoulli[i].z

            let flow = new Flow(cube);
            flow.updateCurve(0, curve)
            flow.moveAlongCurve(i * 1 / global.nbInvaders);

            cubes.add(flow.object3D);
            flows.push(flow);
        }

        // scene.add(cubes);

        console.log(scene)

        return {
            pointsBernoulli,
            cubes,
            curve,
            flows
        }
    }

    testUpdate(delta) {
        let taille = this.obj.cubes.children.length;
        let cubes = this.obj.cubes.children;
        // let Bernoulli = this.obj.pointsBernoulli
        // let scale = this.obj.scale;
        // let t = 0;
        // let s = 1 * delta;
        for(let i = 0; i < taille; i++) {
            this.obj.flows[i].moveAlongCurve(delta * 0.06)
            cubes[i].rotation.set(0, 0, 0);
        }
        //     let arrows = cubes;
        //     let path = this.obj.curve;
        //     // Ca commence à me saouler

        //     // let x = (scale * Math.cos(cubes[i].position.x)) / (1 + Math.pow(Math.sin(cubes[i].position.x), 2));
        //     // let z = (scale * Math.sin(cubes[i].position.z) * Math.cos(cubes[i].position.z)) / (1 + Math.pow(Math.sin(cubes[i].position.z), 2));

        //     // cubes[i].position.x = x * delta;
        //     // cubes[i].position.z = z * delta;


            // if(cubes[i].position.distanceTo(Bernoulli[cubes[i].target]) < 5) {
            //     cubes[i].target = (cubes[i].target+1)%taille;
            // }
            // cubes[i].position.lerp(Bernoulli[cubes[i].target], 0.01)

            // cubes[i].position.x += (Bernoulli[cubes[i].target].x - Bernoulli[((cubes[i].target-1 % taille) + taille) % taille].x) * delta;
            // cubes[i].position.z += (Bernoulli[cubes[i].target].z - Bernoulli[((cubes[i].target-1 % taille) + taille) % taille].z) * delta;


        //     // Catmullromcurve peut etre
        // }
        //this.obj.path.update();
        //this.obj.flow.moveAlongCurve(0.001);
    }

    /**
     * Boucle d'animation
     */
    draw() {
        stats.begin();

        this.delta = this.clock.getDelta();

        this.testUpdate(this.delta)

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
    }

    stopGame() {
        console.log('fin du jeu');
        // Afficher ecran de game over
        localStorage.setItem('score', this.score);
        // Afficher recap des scores
    }
}

export {
    gameEvent,
    Game
}