
function showFadingTitle(config, container, callback) {
  const FADE_IN_DURATION = 2000;
  const ERASE_DURATION = 3000; // should be the same as CSS transition duration on eraser, but in ms
  const wrap = $('<div>').addClass('title-wrapper').appendTo(container);
  const title = $('<div>').addClass('title header').text(config.titleText).appendTo(wrap);

  if (config.subtitleText) {
    title.addClass('with-subtitle');
    const subtitle = $('<div>').addClass('subtitle text').text(config.subtitleText).appendTo(wrap);
  }

  const eraser = $('<div>').addClass('eraser');

  function startDelayedEraser() {
    eraser.appendTo(wrap);
    setTimeout(function() {
      eraser.addClass('on');
      // after the transition of eraser, we fade out and call back
      setTimeout(callback, ERASE_DURATION);
    }, 2000);
  }

  if (config.skipFadeIn) {
    wrap.addClass('black');
    startDelayedEraser();
  } else {
    setTimeout(function() {
      wrap.addClass('black');
      // we need to delay creating the eraser until the fade-to-black is completed, otherwise it will show up as a block
      setTimeout(startDelayedEraser, FADE_IN_DURATION);
    }, 2000);
  }
}

function showTask(container, taskMsg) {
  $('<div>').addClass('task-msg text').text('Task: '+taskMsg).appendTo(container);
}

function hideTaskMsg() {
  $('.task-msg').remove();
}

function intro(config, container, callback) {
  showFadingTitle({titleText: 'Succession'}, container, callback);
}

function level_paintFill(config, container, callback) {
  showFadingTitle(
    {
      titleText: 'Chapter One',
      subtitleText: 'Lichens',
      skipFadeIn: true,
    },
    container,
    function() {
      $('.title-wrapper').remove();
      console.log('moving to impl.');
      paintFill_core(config, container, callback);
    }
  );
}

function paintFill_core(config, container, callback) {
  showTask(container, 'Cover 50% of the sunny areas with spores.');
  const WIDTH = 800;
  const HEIGHT = 500;
  let mousePressed = false;
  let paintCount = 0;
  const maxPaintCount = 40;

  const timerWrap = $('<div>').addClass('timer-wrapper');
  const timerLabel = $('<div>').addClass('label').text('Spores left');
  timerLabel.appendTo(timerWrap);
  const timerBar = $('<div>').addClass('bar');
  const timerValue = $('<div>').addClass('value');
  timerValue.appendTo(timerBar);

  timerBar.appendTo(timerWrap);

  timerWrap.appendTo(container); // append before canvas to not mess with mouseover

  // set up canvas
  const canvas = $('<canvas>').attr('width', WIDTH).attr('height', HEIGHT);
  canvas.css('border', '1px solid red');
  canvas.css('opacity', '0.33');
  canvas.appendTo(container);

  const ctx = canvas[0].getContext('2d');
  ctx.fillStyle = 'green';

  // set up UI updates

  function update() {
    if (mousePressed) {
      // register paint count -- note that we don't increase the counter on mousemove,
      // because the frequency of those events is highly platform-specific
      paintCount++;
      if (paintCount > maxPaintCount) {
        timerValue.css('width', 0);
        evaluate();
      } else {
        const pct = (maxPaintCount-paintCount)/maxPaintCount * 100;
        timerValue.css('width', pct + '%');
      }
    }
  }

  let updateInterval = setInterval(update, 100);

  let attempts = 0;
  function evaluate() {
    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    const data = imageData.data;
    let c1 = 0;
    let c2 = 0;
    for (let i = 0; i < data.length; i += 4) {
      const col = i%(WIDTH*4) / 4;
      if (col < 300) { // clear first n cols
        // NB: we don't write it back to the canvas, just clearing it for the counting below
        data[i + 3] = 0;
      }

      if (data[i + 3]) { // counting alpha channel
        c1++;
      } else {
        c2++;
      }
    }
    const result = c1 / (c1+c2);
    console.log('colored ratio:', result);
    const threshold = 0.4; // NB: the cleared cols change the available area!
    if (result >= threshold) {
      clearInterval(updateInterval);
      successSound.play();
      callback({
        result: result,
        attempts: attempts
      });
    } else {
      errorSound.play();
      attempts++;
      mousePressed = false; //otherwise you can just hold and keep failing
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      timerValue.css('width', '100%');
      paintCount = 0;
    }
  }

  // set up interaction
  canvas.on('mousedown', (event) => {
    mousePressed = true;
  });
  canvas.on('mousemove', (event) => {
    if (mousePressed) {
      ctx.beginPath();
      ctx.arc(event.clientX, event.clientY, 30, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
  canvas.on('mouseup', (event) => {
    mousePressed = false;
  });
}

function level2Impl(config, container, callback) {
  console.log('Starting level 2 with conf:', config);

  const div1 = $('<div>').addClass('test-sq');
  const div2 = $('<div>').addClass('test-sq');

  container.append(div1);
  container.append(div2);

  let d1Clicked = false;
  let d2Clicked = false;

  div1.on('click', () => {d1Clicked = true; checkComplete();})
  div2.on('click', () => {d2Clicked = true; checkComplete();})

  function checkComplete() {
    if (d1Clicked && d2Clicked) {
      callback('done!');
    }
  }
}

let currentLevel = 0;
const levels = [{
  name: 'intro',
  config: {},
  controller: intro
}, {
  name: 'test level',
  config: {
    valueA: 5,
    valueB: 25
  },
  controller: level_paintFill
}, {
  name: 'test2',
  config: {},
  controller: level2Impl
}];

levels.forEach((o,i) => {
  console.assert(o.name, 'No name for level', i);
  console.assert(o.config, 'No config for level', i);
  console.assert(o.controller, 'No controller for level', i);
});
