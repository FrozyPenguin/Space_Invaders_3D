// cette classe devra charger les niveaux et leurs configurations

// Placements : Classis | Lemniscate
// Le tableaux Models doit contenir autant de model que l'objet à de point de vie
// On peut imaginer que chaque objet aura un parse config qui lui permettra d'être configuré
// Genre Defender.parseConfig(defenderConfig) et dedans on aura this.speed = defenderConfig.speed etc
// Ne pas hésiter à utiliser le chainage optionnel
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Optional_chaining

class LevelManager {
    constructor() {
        this.current = 0;
    }

    nextLevel() {
        this.current++;
        return this.load(this.current);
    }

    load(levelId) {
        return fetch(`/src/levels/level-${levelId}.json`);

        // return new Promise((resolve, reject) => {
        //     var http = new XMLHttpRequest();
        //     http.onreadystatechange = () => {
        //         if (http.readyState == 4 && http.status == 200) {
        //             let response = http.response;
        //             resolve();
        //         }
        //         else if (http.readyState == 4 && http.status != 200) reject(http);
        //     };

        //     http.open('GET', `/src/js/levels/level-${levelId}.json`, true);
        //     http.responseType = 'json';
        //     http.send();
        // })
    }

    resetLevel() {
        this.current = 0;
    }
}

export {
    LevelManager
}