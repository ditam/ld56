
let container;

function startNextLevel() {

  const level = levels[currentLevel];
  console.log(`-starting, level ${currentLevel+1}/${levels.length}`);
  console.log('level ref:', level);

  level.controller(level.config, container, function(res) {
    console.log('level done, result:', res);
    container.empty();
    currentLevel++;
    // TODO: confirm we didn't finish levels - add end condition and scoring
    startNextLevel();
  });
}

let songs, sounds;
let errorSound, successSound;

$(document).ready(function() {
  container = $('#main');

  songs = [
    new Audio('bgmusic.mp3'),
  ];

  errorSound = new Audio('error.mp3');
  successSound = new Audio('success.mp3');

  sounds = [
    errorSound,
    successSound,
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

    currentLevel = 1;
    startNextLevel();
  });

  songs.forEach(countWhenLoaded);
  sounds.forEach(countWhenLoaded);
});
