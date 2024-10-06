
function level1Impl(config, container, callback) {
  console.log('Starting level 1 with conf:', config);

  const WIDTH = 800;
  const HEIGHT = 500;

  const canvas = $('<canvas>').attr('width', WIDTH).attr('height', HEIGHT);
  canvas.css('border', '1px solid red');
  canvas.css('opacity', '0.33');
  canvas.appendTo(container);

  const ctx = canvas[0].getContext('2d');

  ctx.fillStyle = 'green';

  let mousePressed = false;
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

    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    const data = imageData.data;
    let c1 = 0;
    let c2 = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3]) { // counting alpha channel
        c1++;
      } else {
        c2++;
      }
    }
    console.log('colored ratio:', c1 / (c1+c2));
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
  name: 'test level',
  config: {
    valueA: 5,
    valueB: 25
  },
  controller: level1Impl
},{
  name: 'test2',
  config: {},
  controller: level2Impl
}];

levels.forEach((o,i) => {
  console.assert(o.name, 'No name for level', i);
  console.assert(o.config, 'No config for level', i);
  console.assert(o.controller, 'No controller for level', i);
});
