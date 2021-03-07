import { Invader } from "../Characters/invaders.js";
import { Grid } from "./grid.js";

export class CustomPlacement extends Grid {
    createGrid() {
        if(!this.invadersConfig.lines || !(this.invadersConfig.lines instanceof Array) || !this.invadersConfig.lines.length) throw 'Les lignes ne sont pas spécifié';

        let notSameSize = this.invadersConfig.lines.filter(line => line.length != this.invadersConfig.lines[0].length);
        if(notSameSize.length) throw 'La taille de toutes les lignes doit être identique !';

        let notAliasOrName = this.invadersConfig.types.filter(type => !(type.alias ?? type.name));
        if(notAliasOrName.length) throw 'Un ou plusieurs type ne possède ni alias ni nom !';

        this.invadersConfig.lines.forEach((line, lineIndex) => {
            const size = line.length;

            // Place les invaders suivant la configuration de lines dans le fichier JSON
            // Un alias inconnu ou vide résulteras à un espacement
            for(let i = 0; i < size; i++) {
                const alias = line[i];

                let type = this.invadersConfig.types.filter(type => type.alias === alias || type.name === alias ? type : null);
                if(type.length > 1) throw `L'alias de la ligne ${line} à l'indice ${i} est spécifié plus d'une fois dans la déclaration des types !`;

                if(type.length) {
                    type = type[0];
                    const invader = new Invader(this.invadersConfig.size, this.invadersConfig.shootProb, type)

                    invader.position.x = -i * (this.invadersConfig.size + this.invadersConfig.padding);
                    invader.position.z = -lineIndex * (this.invadersConfig.size + this.invadersConfig.padding);

                    this.add(invader);
                }
            }
        })

        // this.invadersConfig.types.reverse().forEach(type => {
        //     if(!type.lineCount) throw "Nombre d'invaders invalide !";

        //     let nbInvaders = type.lineCount * this.invadersConfig.perLine;
        //     for(let i = 0; i < nbInvaders; i++) {
        //         let invader = new Invader(this.invadersConfig.size, this.invadersConfig.shootProb, type);

        //         if(this.children.length != 0) {
        //             if(i  % this.invadersConfig.perLine == 0) {
        //                 lineNumber++;
        //                 invader.position.x = this.children[0].position.x;
        //                 invader.position.z = this.children[lineNumber * this.invadersConfig.perLine - 1].position.z - (this.invadersConfig.size + this.invadersConfig.padding);
        //             }
        //             else {
        //                 invader.position.x = this.children[i % this.invadersConfig.perLine + lineNumber * this.invadersConfig.perLine - 1].position.x - (this.invadersConfig.size + this.invadersConfig.padding);
        //                 invader.position.z = this.children[i % this.invadersConfig.perLine + lineNumber * this.invadersConfig.perLine - 1].position.z;
        //             }
        //         }

        //         this.add(invader);
        //     }
        // })
    }

    getPerLine() {
        return this.invadersConfig.lines[0].length;
    }
}