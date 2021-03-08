import { gameEvent } from '../game.js';

function initDomControls() {
    const pauseBtn = document.querySelector('#pause');
    const playBtn = document.querySelector('#play');
    const soundUnmute = document.querySelector('#soundMute');
    const soundMute = document.querySelector('#soundUnmute');

    pauseBtn.addEventListener('click', pause);

    playBtn.addEventListener('click', play);

    soundMute.addEventListener('click', mute);

    soundUnmute.addEventListener('click', unMute);

    window.addEventListener('blur', blur);

    window.addEventListener('focus', focus);

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

    document.querySelector('#overRetry').addEventListener('click', () => {
        gameEvent.emit('onRetry');
    });

    document.querySelector('#winRetry').addEventListener('click', () => {
        gameEvent.emit('onRetry');
    });
}

export {
    initDomControls
}