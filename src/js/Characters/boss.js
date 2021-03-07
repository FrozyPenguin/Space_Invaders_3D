import { GameObject } from '../StaticElements/gameObject.js';

// TODO: Faire le boss
// Un shield prendra en parametre un position en Z, un espacement entre les murs et un nombre de mur à placer
// La position en Z ca sera defender.position.z - (taille du defender*2)
class Boss extends GameObject {
    // Quand le boss tire il doit précis
    // Pour déterminer le tire soit raycatser
    // Soit on fait une bounding box sur le defender et le boss et on compare le min et le max de la box3 en ajoutant des offsets et si on est dedans alors on tire
}