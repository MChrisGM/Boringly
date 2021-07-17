let canvas;
let point;
let shape;
let final_pos;
let solved = false;
let score = 0;
let highscore;
let size_pct = 0.20;
let trigger_pct = 0.80;
let size;
let maxLength = 1;

let time = 2000;
let time_pct = 0.99;

let startFade = false;
let fade;
let fade_pct = 15;
let fadeAmount = fade_pct;

let x, startAt;

let touchDown = false;

let startGame = true;
let settingsOn = false;
let settingsTime;

let settingsModel = {
  v: 2.1,
  showText: true,
  startTime: 0,
  startTimes: { 0: 2, 1: 5, 2: 10 },
  modes: { 0: 'Freerun', 1: 'Timed' },
  mode: 1
};
let settings;

let toggles = {};

function loadSettings() {
  if (localStorage.hasOwnProperty('settings')) {
    settings = JSON.parse(localStorage.getItem('settings'));
    if (!settings.v || settings.v < settingsModel.v) {
      settings = JSON.parse(JSON.stringify(settingsModel));
    }
  } else {
    settings = JSON.parse(JSON.stringify(settingsModel));
  }
}
function saveSettings() {
  localStorage.setItem('settings', JSON.stringify(settings));
}

function setup() {
  addToHomescreen();
  canvas = createCanvas(innerWidth, innerHeight);
  if (innerWidth > innerHeight) {
    size = height;
  } else {
    size = width;
  }
  background(51);
  loadSettings();
  saveSettings();
  generate_pos(false);
  score = parseInt(localStorage.getItem('score')) || 0;
  time = settings.startTimes[settings.startTime]*1000;
  if (score > 0) {
    for (let i = 0; i < score; i++) {
      time *= time_pct;
    }
  }
  if(!localStorage.getItem('highscore').startsWith('{')){
    highscore = {2:parseInt(localStorage.getItem('highscore')) || 0,5:0,10:0};
  }else{
    highscore = JSON.parse(localStorage.getItem('highscore'));
  }
  localStorage.setItem('highscore', JSON.stringify(highscore));
  fade = 0;
  frameRate(60);
}

function draw() {
  background(51);
  if (startGame && score != 0 && settings.modes[settings.mode] == 'Timed') {
    x = map(millis(), startAt, startAt + time, 0, width);
  } else {
    if (settings.modes[settings.mode] == 'Freerun') {
      x = 0;
    } else {
      x = map(millis(), startAt + (millis() - settingsTime), startAt + (millis() - settingsTime) + time, 0, width);
    }

  }
  if (settings.modes[settings.mode] == 'Timed' && score != 0) {
    stroke(255, 0, 0);
    strokeWeight(20);
    fill(255, 0, 0);
    line(0, 0, width - x, 0);
  }


  drawShapes();

  shape.over();
  shape.update();
  shape.show();

  drawOptions();

  if (createVector(shape.x, shape.y).dist(final_pos) < size_pct * size * trigger_pct) {
    solved = true;
  }

  if (solved) {
    score += 1;
    localStorage.setItem('score', score);
    time *= time_pct;
    if (settings.modes[settings.mode] == 'Timed') {
      if (score > highscore[settings.startTimes[settings.startTime]]) {
        highscore[settings.startTimes[settings.startTime]] = score;
        localStorage.setItem('highscore', JSON.stringify(highscore));
        
      }
    }
    generate_pos(true);
    solved = false;
  }



  if (width - x < 0.01) {
    score = 0;
    localStorage.setItem('score', score);
    startFade = true;
    generate_pos(true);
    time = settings.startTimes[settings.startTime]*1000;
  }

}

function generate_pos(start) {
  point = createVector((size_pct / 2 + Math.random()) * width * (1 - size_pct), (size_pct / 2 + Math.random()) * height * (1 - size_pct));
  final_pos = createVector((size_pct / 2 + Math.random()) * width * (1 - size_pct), (size_pct / 2 + Math.random()) * height * (1 - size_pct));
  while (point.dist(final_pos) < width * size_pct) {
    final_pos = createVector((size_pct / 2 + Math.random()) * width * (1 - size_pct), (size_pct / 2 + Math.random()) * height * (1 - size_pct));
  }
  shape = new Draggable(point.x, point.y, size * size_pct, size * size_pct);
  if (start) {
    startAt = millis();
  }
}

function drawOptions() {

  stroke(180);
  strokeWeight(5);
  line(width * 0.93, height * 0.02, width * 0.98, height * 0.02);
  line(width * 0.93, height * 0.03, width * 0.98, height * 0.03);
  line(width * 0.93, height * 0.04, width * 0.98, height * 0.04);

  if (touchDown && mouseX > width * 0.95 && mouseY < height * 0.04 && !settingsOn) {
    settingsOn = true;
    startGame = false;
    settingsTime = millis();
  }
  if (touchDown && mouseX > width * 0.9 && mouseX < width * 0.94 && mouseY < height * 0.06 + ((width * 0.94) - (width * 0.9)) && settingsOn) {
    settingsOn = false;
    startGame = true;
    startAt += millis() - settingsTime;
  }
  if (settingsOn) {
    rectMode(CORNER);
    fill(85);
    stroke(85);
    rect(width * 0.05, height * 0.05, width * 0.9, height * 0.7, 10);
    stroke(255, 100, 100);
    strokeWeight(3);
    line(width * 0.91, height * 0.06, width * 0.94, height * 0.06 + ((width * 0.94) - (width * 0.91)));
    line(width * 0.91, height * 0.06 + ((width * 0.94) - (width * 0.91)), width * 0.94, height * 0.06);

    textAlign(CENTER);
    textSize(size * 0.15);
    fill(255);
    stroke(0);
    strokeWeight(8);
    text('Settings', width / 2, height * 0.15);

    textSize(size * 0.05);
    fill(255);
    stroke(0);
    strokeWeight(3);
    textAlign(LEFT);
    text('Show background text', width * 0.15, height * 0.3 + (size * 0.05) / 2);

    toggles['showText'] = new Toggle('showText', createVector(width * 0.8, height * 0.3), createVector(size * 0.1, size * 0.05), settings.showText, function () {
      settings.showText = !settings.showText;
      saveSettings();
    }, 'toggle', []).display();


    textSize(size * 0.05);
    fill(255);
    stroke(0);
    strokeWeight(3);
    textAlign(LEFT);
    text('Mode', width * 0.15, height * 0.4 + (size * 0.05) / 2);

    toggles['mode'] = new Toggle('mode', createVector(width * 0.8, height * 0.4), createVector(size * 0.3, size * 0.05), settings.mode, function () {
      settings.mode = this.output;
      saveSettings();
      score = 0;

    }, 'options', Object.values(settings.modes)).display();


    textSize(size * 0.05);
    fill(255);
    stroke(0);
    strokeWeight(3);
    textAlign(LEFT);
    text('Starting time', width * 0.15, height * 0.5 + (size * 0.05) / 2);

    toggles['time'] = new Toggle('time', createVector(width * 0.8, height * 0.5), createVector(size * 0.25, size * 0.05), settings.startTime, function () {
      settings.startTime = this.output;
      saveSettings();
      score = 0;
      time = settings.startTimes[settings.startTime]*1000;
    }, 'options', Object.values(settings.startTimes)).display();
  }

}


function drawShapes() {

  strokeWeight(2);
  stroke(0);
  textAlign(CENTER);
  textSize(size * 0.3);
  fill(90);

  if (settings.showText) {
    text('' + score, width / 2, height / 2);
  }

  if (settings.modes[settings.mode] == 'Timed') {
    if (settings.showText) {
      textSize(size * 0.08);
      fill(90);
      text('Seconds: ' + (time / 1000).toPrecision(3), width / 2, height * 3 / 4);

      textSize(size * 0.08);
      fill(90);
      text('Highscore: ' + highscore[settings.startTimes[settings.startTime]], width / 2, height / 4);
    }
  }

  noStroke();
  fill(120);
  ellipse(final_pos.x, final_pos.y, size * size_pct, size * size_pct);
  fill(120);
  ellipse(point.x, point.y, size * size_pct, size * size_pct);

  angleMode(DEGREES);
  push();
  rectMode(CENTER);
  translate((point.x + final_pos.x) / 2, (point.y + final_pos.y) / 2);
  rotate(angle(point.x, point.y, final_pos.x, final_pos.y));
  fill(120);
  rect(0, 0, point.dist(final_pos), size * size_pct);
  pop();

  stroke(0);
  fill(255, 255, 255);
  ellipse(final_pos.x, final_pos.y, size * size_pct, size * size_pct);
}

function mouseClicked() {
  if (settingsOn) {
    for (let t of Object.getOwnPropertyNames(toggles)) {
      toggles[t].onCall();
    }
  }
  return false;
}

function touchStarted() {
  if (startGame) {
    shape.pressed();
  }
  touchDown = true;
  if (settingsOn) {
    for (let t of Object.getOwnPropertyNames(toggles)) {
      toggles[t].onCall();
    }
  }

  return false;
}

function touchEnded() {
  if (startGame) {
    shape.released();
  }
  if (!solved) {
    shape = new Draggable(point.x, point.y, size * size_pct, size * size_pct);
  }
  touchDown = false;
  return false;
}

function mousePressed() {
  if (startGame) {
    shape.pressed();
  }
  touchDown = true;
  return false;
}

function mouseReleased() {
  if (startGame) {
    shape.released();
  }
  if (!solved) {
    shape = new Draggable(point.x, point.y, size * size_pct, size * size_pct);
  }
  touchDown = false;
  return false;
}

function angle(originX, originY, targetX, targetY) {
  var dx = originX - targetX;
  var dy = originY - targetY;
  var theta = Math.atan2(-dy, -dx);
  theta *= 180 / Math.PI;
  if (theta < 0) theta += 360;
  return theta;
}

function windowResized() {
  location.reload();
}

window.addEventListener("scroll", (e) => {
  e.preventDefault();
  window.scrollTo(0, 0);
});

async function analytics() {
  let http = new XMLHttpRequest();
  let url = '/count';
  function text(url) { return fetch(url).then(res => res.text()); }
  let an = await text('https://www.cloudflare.com/cdn-cgi/trace').then(data => {
    return data.match(/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/)[0];
  });
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/json');
  http.setRequestHeader('user', an)
  http.send();
}

const findLongest = words => Math.max(...(words.map(el => el.length)));