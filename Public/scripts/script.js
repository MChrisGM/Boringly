let canvas;
let point;
let shape;
let final_pos;
let solved = false;
let score = 0;
let highscore;
let size_pct = 0.15;
let trigger_pct = 0.75;

let time = 2000;
let time_pct = 0.98;

let startFade = false;
let fade;
let fade_pct = 25;
let fadeAmount = fade_pct;

var x,startAt;

function setup() {
  addToHomescreen();
  canvas = createCanvas(innerWidth, innerHeight);
  background(51);
  generate_pos();
  score = parseInt(localStorage.getItem('score')) || 0;
  if(score > 0){
    for(let i = 0; i<score;i++){
      time*=time_pct;
    }
  }
  highscore = parseInt(localStorage.getItem('highscore')) || 0;
  fade = 0
  frameRate(60);
}

function draw() {
  background(51);

  stroke(255, 0, 0);
  strokeWeight(10);

  x = map(millis(), startAt, startAt + time, 0, width);
  line(0, 0, width - x, 0);
  
  drawShapes();

  shape.over();
  shape.update();
  shape.show();

  if (createVector(shape.x, shape.y).dist(final_pos) < size_pct * width * trigger_pct) {
    solved = true;
  }

  if (solved) {
    score += 1;
    time *= time_pct;
    if(score > highscore){
      localStorage.setItem('highscore', score);
      highscore = score;
    }
    generate_pos();
    solved = false;
  }

  

  if (width - x < 0.1){
    score = 0;
    localStorage.setItem('score', score);
    startFade = true;
    generate_pos();
    time = 2000;
  }

  if (startFade) {
    fadeAmount=fade_pct;
  }
 
  if (fade>=255){
    fadeAmount=-fade_pct;
    startFade = false;
  }
  
  if(startFade || fade >= 0){
    fade += fadeAmount; 
  }

  fill(0,150,0,fade);
  rectMode(CORNER);
  rect(0,0,width,height);
}

function generate_pos() {
  point = createVector((size_pct / 2 + Math.random()) * width * (1 - size_pct), (size_pct / 2 + Math.random()) * height * (1 - size_pct));
  final_pos = createVector((size_pct / 2 + Math.random()) * width * (1 - size_pct), (size_pct / 2 + Math.random()) * height * (1 - size_pct));
  while (point.dist(final_pos) < width * size_pct) {
    final_pos = createVector((size_pct / 2 + Math.random()) * width * (1 - size_pct), (size_pct / 2 + Math.random()) * height * (1 - size_pct));
  }
  shape = new Draggable(point.x, point.y, width * size_pct, width * size_pct);

  startAt = millis();
}


function drawShapes() {

  strokeWeight(2);
  stroke(0);

  textAlign(CENTER);
  textSize(width * 0.3);
  fill(90);
  text('' + score, width / 2, height / 2);

  textSize(width * 0.08);
  fill(90);
  text('Seconds: ' + (time/1000).toPrecision(3), width / 2, height * 2/ 3);

  textSize(width * 0.08);
  fill(90);
  text('Highscore: ' + highscore, width / 2, height / 3);

  noStroke();
  fill(120);
  ellipse(final_pos.x, final_pos.y, width * size_pct, width * size_pct);
  fill(120);
  ellipse(point.x, point.y, width * size_pct, width * size_pct);

  angleMode(DEGREES);
  push();
  rectMode(CENTER);
  translate((point.x + final_pos.x) / 2, (point.y + final_pos.y) / 2);
  rotate(angle(point.x, point.y, final_pos.x, final_pos.y));
  fill(120);
  rect(0, 0, point.dist(final_pos), width * size_pct);
  pop();

  stroke(0);
  fill(255, 255, 255);
  ellipse(final_pos.x, final_pos.y, width * size_pct, width * size_pct);
}

function touchStarted() {
  shape.pressed();
  return false;
}

function touchEnded() {
  shape.released();
  if (!solved) {
    shape = new Draggable(point.x, point.y, width * size_pct, width * size_pct);
  }
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
  canvas = createCanvas(innerWidth, innerHeight);
  background(51);
  generate_pos();
}

window.addEventListener("scroll", (e) => {
  e.preventDefault();
  window.scrollTo(0, 0);
});