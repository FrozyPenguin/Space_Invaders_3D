/**
 * Calcul les coordonnés de la lemniscate de Bernoulli
 * @param { Number } scale Taille de la courbe
 * @param { Number } nbPoints Nombre de points à calculer
 * @return { Array } Retourne un Vector2D de coordonné de point de la courbe
 */
export function Bernoulli(scale = 1, nbPoints) {
    let points = [];
    for(let t = -Math.PI; t < Math.PI; t += Math.PI / nbPoints * 2) {
        // Lemniscate de Bernoulli
        let x = (scale * Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2));
        let y = (scale * Math.sin(t) * Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2));
        points.push({ x, y });
    }
    return points;
}

/**
 * Calcul les coordonnés de la lemniscate de Gerono
 * @param { Number } scale Taille de la courbe
 * @param { Number } nbPoints Nombre de points à calculer
 * @return { Array } Retourne un Vector2D de coordonné de point de la courbe
 */
export function Gerono(scale, nbPoints) {
    let points = [];
    for(let t = -Math.PI; t < Math.PI; t += Math.PI / nbPoints * 2) {
        // Lemniscate de Gerono
        //x = a.sin(t) et y = a.sin(t).cos(t).
        let x = scale * Math.sin(t)
        let y = scale * Math.sin(t) * Math.cos(t)
        points.push({ x, y });
    }
    return points;
}