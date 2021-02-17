import { gameEvent } from '../game.js';

const pauseBtn = document.querySelector('#pause');
const playBtn = document.querySelector('#play');
const soundUnmute = document.querySelector('#soundMute');
const soundMute = document.querySelector('#soundUnmute');

function initDomControls() {
    pauseBtn.addEventListener('click', pause)

    playBtn.addEventListener('click', play)

    soundMute.addEventListener('click', mute)

    soundUnmute.addEventListener('click', unMute)

    window.addEventListener('blur', event => {
        pause();
        mute();
    })

    window.addEventListener('focus', event => {
        // play();
        unMute();
    })

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
}

export {
    initDomControls
}