const heart = document.querySelector('#refHeart');
const heartContainer = document.querySelector('#heartContainer');

/**
 * Ajoute un coeur à l'écran
 */
function addHeart() {
    let lastHeart = document.querySelector('#heartContainer .heart:not(#refHeart):last-child');
    let heartPosLeft = 5;

    if(lastHeart) {
        // Number.parseFloat() permet de retirer le suffix px et de retouner la partie décimal
        heartPosLeft += Number.parseFloat(window.getComputedStyle(lastHeart).left);
        heartPosLeft += Number.parseFloat(window.getComputedStyle(lastHeart).width);
    }

    const newHeart = heart.cloneNode(true);
    newHeart.id = '';
    newHeart.style.left = `${heartPosLeft}px`;
    newHeart.style.display = 'block';
    heartContainer.append(newHeart);
}

/**
 * Vide un coeur.
 * @return { Number } Nombre de coeur restant
 */
function takeDamage() {
    let remainingHeart = document.querySelectorAll('#heartContainer .heart:not(#refHeart):not(.empty)');
    if(remainingHeart.length != 0) {
        remainingHeart[remainingHeart.length-1].classList.add('empty');
        return remainingHeart.length-1;
    }
    else return 0;
}

/**
 * Rempli un coeur. Si tout les coeurs sont rempli, en ajoute un.
 * @return { Number } Nombre de coeur restant
 */
function giveHealth() {
    let lastHeart = document.querySelector('#heartContainer .heart.empty:not(#refHeart):last-child');
    if(lastHeart) lastHeart.classList.remove('empty');
    else addHeart();
    return document.querySelectorAll('#heartContainer .heart:not(#refHeart):not(.empty)').length;
}

/**
 * Initialise la vie
 * @param { Number } healthCount Nombre total de coeur
 */
function initHealth(healthCount) {
    for(let i = 0; i < healthCount; i++) {
        addHeart();
    }
}

export {
    addHeart,
    takeDamage,
    initHealth,
    giveHealth
}