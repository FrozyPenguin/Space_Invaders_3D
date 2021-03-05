import { Bernoulli, Gerono } from '../Utils/lemniscate.js';
import { Flow, InstancedFlow } from '../../lib/Three.js/examples/jsm/modifiers/CurveModifier.js';
import global from '../global.js';
import { scene } from '../scene.js';
import * as THREE from '../../lib/Three.js/build/three.module.js';

export class Lemniscate {
    constructor(speed = 0.04, nbPoints = global.nbInvaders) {
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_modifier_curve_instanced.html
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_modifier_curve.html

        this.speed = speed;

        // Dessine la lemniscate
        let scale = global.invadersPerLine * (global.invadersPadding + global.invadersSize);
        let pointsBernoulli = Bernoulli(scale, nbPoints);

        pointsBernoulli = pointsBernoulli.map(point => new THREE.Vector3( point.x, global.invadersSize / 2 + 0.001, point.y ));

        const cubes = new THREE.Group();
        cubes.name = 'Les Envahisseurs du 8 perdu !';
        const flows = [];

        const curve = new THREE.CatmullRomCurve3(pointsBernoulli);
        curve.curveType = "centripetal";
        curve.closed = true;


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

        this.pointsBernoulli = pointsBernoulli;
        this.cubes = cubes;
        this.flows = flows;
    }

    update(delta) {
        let taille = this.cubes.children.length;
        let cubes = this.cubes.children;
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

    addInvaders() {
        scene.add(this.cubes);
    }
}