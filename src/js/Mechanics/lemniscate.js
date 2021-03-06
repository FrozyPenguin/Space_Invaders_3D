import { Bernoulli, Gerono } from '../Utils/lemniscate.js';
import { Flow, InstancedFlow } from '../../lib/Three.js/examples/jsm/modifiers/CurveModifier.js';
import global from '../global.js';
import { scene } from '../scene.js';
import * as THREE from '../../lib/Three.js/build/three.module.js';
import { Invader } from '../Characters/invaders.js';

export class Lemniscate extends THREE.Group {
    constructor(name, speed = 0.04, nbPoints = global.nbInvaders) {
        super();
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_modifier_curve_instanced.html
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_modifier_curve.html

        this.speed = speed;

        this.name = name;
        this.nbPoints = nbPoints;

    }

    createLemniscate() {
        // Dessine la lemniscate
        let scale = global.invadersPerLine * (global.invadersPadding + global.invadersSize);
        let pointsBernoulli = Bernoulli(scale, this.nbPoints);

        pointsBernoulli = pointsBernoulli.map(point => new THREE.Vector3( point.x, global.invadersSize / 2 + 0.001, point.y ));

        const flows = [];

        const curve = new THREE.CatmullRomCurve3(pointsBernoulli);
        curve.curveType = "centripetal";
        curve.closed = true;

        for(let i = 0; i < pointsBernoulli.length; i++) {
            // const invaderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
            // const invaderMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
            //const cube = new THREE.Mesh(invaderGeometry, invaderMaterial);
            const cube = new Invader(0xffffff, "Oui", 10);

            // cube.position.x = pointsBernoulli[i].x
            // cube.position.y = pointsBernoulli[i].y
            // cube.position.z = pointsBernoulli[i].z

            let flow = new Flow(cube);

            flow.updateCurve(0, curve)
            flow.moveAlongCurve(i * 1 / global.nbInvaders);

            this.add(flow.object3D);
            flows.push(flow);
        }

        this.pointsBernoulli = pointsBernoulli;
        this.flows = flows;
    }

    reset() {

    }

    update(delta) {
        let taille = this.children.length;
        let cubes = this.children;
        // let Bernoulli = this.obj.pointsBernoulli
        // let scale = this.obj.scale;
        // let t = 0;
        // let s = 1 * delta;
        for(let i = 0; i < taille; i++) {
            this.flows[i].moveAlongCurve(delta * this.speed)
            cubes[i].rotation.set(0, 0, 0);
        }
    }

    addHelper() {
        const line = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints( this.pointsBernoulli ),
            new THREE.LineBasicMaterial( { color: 0x00ff00 } )
        );

        scene.add(line);
    }
}