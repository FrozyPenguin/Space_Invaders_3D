const pauseBtn = document.querySelector('#pause');
const playBtn = document.querySelector('#play');
const soundMute = document.querySelector('#soundMute');
const soundUnmute = document.querySelector('#soundUnmute');

function initDomControls() {
    pause.addEventListener('click', event => {
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'block';

        // Emit pause
    })

    play.addEventListener('click', event => {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';

        // Emit play
    })

    soundMute.addEventListener('click', event => {
        soundMute.style.display = 'none';
        soundUnmute.style.display = 'block';

        // Emit pause
    })

    soundUnmute.addEventListener('click', event => {
        soundUnmute.style.display = 'none';
        soundMute.style.display = 'block';

        // Emit play
    })
}

export {
    initDomControls
}