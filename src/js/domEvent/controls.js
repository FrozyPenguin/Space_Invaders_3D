import { gameEvent } from '../game.js';

let pauseBtn = null;
let playBtn = null;
let soundUnmute = null;
let soundMute = null;

let userMuted = false;
let userPaused = false;

function initDomControls() {
    pauseBtn = document.querySelector('#pause');
    playBtn = document.querySelector('#play');
    soundUnmute = document.querySelector('#soundMute');
    soundMute = document.querySelector('#soundUnmute');

    pauseBtn.addEventListener('click', (event) => {
        userPaused = true;
        pause(event);
    });

    playBtn.addEventListener('click', (event) => {
        userPaused = false;
        play(event);
    });

    soundMute.addEventListener('click', (event) => {
        userMuted = true;
        mute(event);
    });

    soundUnmute.addEventListener('click', (event) => {
        userMuted = false;
        unMute(event);
    });

    window.addEventListener('blur', blur);

    window.addEventListener('focus', focus);

    document.querySelector('#overRetry').addEventListener('click', () => {
        gameEvent.emit('onRetry');
    });

    document.querySelector('#winRetry').addEventListener('click', () => {
        gameEvent.emit('onRetry');
    });
}

function blur(event) {
    pause();
    mute();
}

function focus(event) {
    // play();
    //unMute();
}

function pause(event) {
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'block';

    // Emit pause
    gameEvent.emit('onPause');
}

function play(event) {
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'block';

    // Emit play
    gameEvent.emit('onResume');
}

function mute(event) {
    soundMute.style.display = 'none';
    soundUnmute.style.display = 'block';

    // Emit mute
    gameEvent.emit('onMute');
}

function unMute(event) {
    soundMute.style.display = 'block';
    soundUnmute.style.display = 'none';

    // Emit unmute
    gameEvent.emit('onUnMute');
}

export {
    initDomControls,
    pause,
    mute,
    unMute,
    play,
    focus,
    blur,
    userMuted,
    userPaused
}