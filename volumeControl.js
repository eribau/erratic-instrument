const volumeSlider = document.querySelector('#volume');

volumeSlider.addEventListener('input', (e) => getVolume(e));

function getVolume(e) {
   webAudioXML.setVariable("vol", parseFloat(volume.value));
};

const ev = new InputEvent('input', {
   bubbles: true,
   cancelable: false
});

setTimeout(() => {volumeSlider.dispatchEvent(ev);}, 300)



