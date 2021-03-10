import * as THREE from '../lib/Three.js/build/three.module.js';
import global from './global.js';

// Création de la scene 3D
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x581845);

// Création du canvas 3D et ajout de celui-ci à la page HTML
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
global.parent.appendChild(renderer.domElement);

// Ajoute une lumière ambiante à la scene
const ambient = new THREE.AmbientLight(0xffffff, 1);
ambient.position.y = 0;
scene.add(ambient);

const light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
scene.add( light );

// const directionalLight = new THREE.DirectionalLight( 0xffffff, 10 );
// scene.add( directionalLight );

// const loader = new OBJLoader();
// // Load a glTF resource
// loader.load(
// 	// resource URL
// 	'/src/medias/models/chest.obj',
// 	// called when the resource is loaded
// 	function ( object ) {

//         console.log(object.scene)

//         object.scale.x = 1;
//         object.scale.y = 1;
//         object.scale.z = 1;
// 		scene.add( object );

// 		// gltf.animations; // Array<THREE.AnimationClip>
// 		// gltf.scene; // THREE.Group
// 		// gltf.scenes; // Array<THREE.Group>
// 		// gltf.cameras; // Array<THREE.Camera>
// 		// gltf.asset; // Object

//         console.log(scene)

// 	},
// 	// called while loading is progressing
// 	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 		console.log( 'An error happened', error );

// 	}
// );

// const loader = new GLTFLoader();
// loader.setPath('/src/medias/models/');
// loader.load(
// 	// resource URL
// 	'eevee.gltf',
// 	// called when the resource is loaded
// 	function ( object ) {

//         console.log(object)

//         object.scene.scale.x = global.invadersSize;
//         object.scene.scale.y = global.invadersSize;
//         object.scene.scale.z = global.invadersSize;

//         object.scene.position.x = -0;

//         //directionalLight.target = object.scene

//         object.scene.traverse( child => {
//             if ( child.material ) child.material.metalness = 0;
//         } );

// 		scene.add( object.scene );

// 		// gltf.animations; // Array<THREE.AnimationClip>
// 		// gltf.scene; // THREE.Group
// 		// gltf.scenes; // Array<THREE.Group>
// 		// gltf.cameras; // Array<THREE.Camera>
// 		// gltf.asset; // Object

//         console.log(scene)

// 	},
// 	// called while loading is progressing
// 	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 		console.log( 'An error happened', error );

// 	}
// );

// const loader = new OBJLoader();
//     const mtlLoader = new MTLLoader();
//     loader.setPath('/src/medias/models/');
//     mtlLoader.setPath('/src/medias/models/');

//     mtlLoader.load('Cute_Cartoon_Character.mtl', (texture) => {
//         texture.preload();
//         loader.setMaterials(texture);
//         console.log(texture)

//         loader.load('Cute_Cartoon_Character.obj',
//             (model) => {

//                 for(let child of model.children) {
//                     child.position.set(0, 0, 0);
//                     child.scale.set(10, 10, 10);
//                 }

//                 model.scale.set(2, 2, 2);
//                 model.rotation.y = Math.PI;
//                 //model.children[1].rotation.x = Math.PI;

//                 console.log(model);

//                 scene.add(model);
//             },
//             (xhr) => { // onProgress
//                 console.log((xhr.loaded / xhr.total * 100 ) + '% loaded');
//             },
//             (error) => { // onError
//                 console.error(error);
//             }
//         );
//     });

export {
    scene,
    renderer
}