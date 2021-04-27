import { gameEvent } from '../game.js';

let pauseBtn = null;
let playBtn = null;
let soundUnmute = null;
let soundMute = null;
let enGamePannel = null;

let userMuted = false;
let userPaused = false;

function initDomControls() {
    pauseBtn = document.querySelector('#pause');
    playBtn = document.querySelector('#play');
    soundUnmute = document.querySelector('#soundMute');
    soundMute = document.querySelector('#soundUnmute');
    enGamePannel = document.querySelector('#enGamePannel');

    pauseBtn.addEventListener('click', (event) => {
        userPaused = true;
        console.log(userPaused)
        pause(event);
    });

    playBtn.addEventListener('click', (event) => {
        userPaused = false;
        console.log(userPaused)
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

    document.querySelectorAll('.retry').forEach(child => child.addEventListener('click', () => {
        userPaused = false;
        gameEvent.emit('onRetry');
    }));

    document.querySelectorAll('.toGameMenu').forEach(child => child.addEventListener('click', () => {
        gameEvent.emit('onMenu');
    }));

    document.querySelector('#startGame').addEventListener('click', () => {
        gameEvent.emit('onStartGame');
    });

    window.addEventListener('resize', () => {
        gameEvent.emit('onResize');
    })

    document.querySelector('#endGameButton').addEventListener('click', () => {
        userPaused = false;
        gameEvent.emit('onEndGame');
    })

    document.querySelector('#resumeGameButton').addEventListener('click', (event) => {
        userPaused = false;
        play(event);
    })
}

function blur(event) {
    pause();
    mute();
}

function focus(event) {
    // play();
    //unMute();
}

function pause(event, levelChange) {
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'block';
    enGamePannel.style.display = 'block';

    // Emit pause
    gameEvent.emit('onPause', levelChange);
}

function play(event) {
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    enGamePannel.style.display = 'none';

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

function changeMute() {
    if(soundMute.style.display != 'none') {
        userMuted = true;
        mute();
    }
    else {
        userMuted = false;
        unMute();
    }
}

function changePause() {
    if(pauseBtn.style.display != 'none') {
        userPaused = true;
        pause();
    }
    else {
        userPaused = false;
        play();
    }
}

export {
    initDomControls,
    pause,
    mute,
    unMute,
    play,
    focus,
    blur,
    changeMute,
    changePause,
    userMuted,
    userPaused
}