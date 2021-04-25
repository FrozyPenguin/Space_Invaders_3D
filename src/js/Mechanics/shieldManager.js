import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/build/three.module.js';
import { Shield } from './shield.js';

export class ShieldManager extends THREE.Group {
    constructor(name, shieldConfig, position) {
        super();
        this.shieldConfig = shieldConfig;
        this.name = name;
        this.position.z = position;
    }

    createShield() {
        // Régénération des bouclier
        // if(this.children.length) {
        //     this.children.forEach(shield => {
        //         shield.regen();
        //     })
        //     return;
        // }

        // Création des boucliers
        for(let i = 0; i < this.shieldConfig.count; i++) {
            const shield = new Shield(this.shieldConfig);

            if(i != 0) {
                // Place à gauche
                const offset = this.children[i - 2]?.position.x ?? 0;
                if(i % 2) shield.position.x = offset + this.shieldConfig.padding + this.shieldConfig.width;
                else shield.position.x = -(Math.abs(offset) + this.shieldConfig.padding + this.shieldConfig.width);
            }

            this.add(shield)
        }
    }
}