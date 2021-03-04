// cette classe devra charger les niveaux et leurs configurations

// Placements : Classis | Lemniscate
// Le tableaux Models doit contenir autant de model que l'objet à de point de vie
// On peut imaginer que chaque objet aura un parse config qui lui permettra d'être configuré
// Genre Defender.parseConfig(defenderConfig) et dedans on aura this.speed = defenderConfig.speed etc
// Ne pas hésiter à utiliser le chainage optionnel
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Optional_chaining

class LevelManager {
    constructor() {
        this.current = 1;
    }

    nextLevel() {
        this.current++;
    }
}

export {
    LevelManager
}