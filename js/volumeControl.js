const volumeSlider = document.querySelector('#volume');

volumeSlider.addEventListener('input', getVolume);

function getVolume() {
   webAudioXML.setVariable("vol", parseFloat(volume.value));
};


