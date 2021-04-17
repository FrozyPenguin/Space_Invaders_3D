import { Vector2 } from '../../lib/Three.js/build/three.module.js';
import { EffectComposer } from '../../lib/Three.js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../lib/Three.js/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../../lib/Three.js/examples/jsm/postprocessing/ShaderPass.js';
import { PixelShader } from '../../lib/Three.js/examples/jsm/shaders/PixelShader.js';


class PixelsPostProcessing {$
    constructor(renderer, scene, camera, pixelSize) {
        this.composer = new EffectComposer(renderer);
        this.composer.addPass(new RenderPass(scene, camera));

        this.pixelPass = new ShaderPass(PixelShader);
        this.pixelPass.uniforms['resolution'].value = new Vector2(window.innerWidth, window.innerHeight);
        this.pixelPass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio);
        this.pixelPass.uniforms['pixelSize'].value = pixelSize;
        this.composer.addPass(this.pixelPass);
    }

    resize() {
        this.pixelPass.uniforms['resolution'].value.set(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
    }

    update() {
        this.composer.render();
    }
}

export {
    PixelsPostProcessing
}