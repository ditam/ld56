
const WIDTH = 800;
const HEIGHT = 500;

let ctx;

let xPosition = 0;

let container;

function start() {

  const level = levels[currentLevel];
  console.log(`-starting, level ${currentLevel}/${levels.length}`);
  console.log('level ref:', level);

  level.controller(level.config, container, function(res) {
    console.log('level done, result:', res);
  });
}

let songs, sounds;

$(document).ready(function() {
  container = $('#main');

  songs = [
    new Audio('bgmusic.mp3'),
  ];

  errorSound = new Audio('error.mp3');

  sounds = [
    errorSound,
  ];

  let audioLoadCount = 0;
  $('#loadCountTotal').text(songs.length + sounds.length);
  function countWhenLoaded(audioElement) {
    audioElement.addEventListener('canplaythrough', function() {
      audioLoadCount++;
      $('#loadCount').text(audioLoadCount);
    }, false);
  }

  $('#splash').on('click', function() {
    $('#splash').remove();
    songs[0].play();
    songs[0].addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);

    start();
  });

  songs.forEach(countWhenLoaded);
  sounds.forEach(countWhenLoaded);
});
