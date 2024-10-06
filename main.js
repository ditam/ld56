
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

$(document).ready(function() {
  container = $('#main');
  start();
});
