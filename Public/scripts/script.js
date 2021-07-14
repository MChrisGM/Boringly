let canvas;
let point;
let shape;
let final_pos;
let solved = false;
let score = 0;
let size_pct = 0.15;
let trigger_pct = 0.5;

function setup() {
    addToHomescreen();
    canvas = createCanvas(innerWidth, innerHeight);
    background(51);
    generate_pos();
    score = parseInt(localStorage.getItem('score')) || 0;
}

function draw() {
    background(51);
    drawShapes();

    shape.over();
    shape.update();
    shape.show();

    if(createVector(shape.x,shape.y).dist(final_pos) < size_pct*width*trigger_pct){
        solved = true;
    }

    if (solved) {
        score += 1;
        localStorage.setItem('score', score);
        generate_pos();
        solved = false;
    }
}

function generate_pos() {
    point = createVector((size_pct / 2 + Math.random()) * width * (1 - size_pct), (size_pct / 2 + Math.random()) * height * (1 - size_pct));
    final_pos = createVector((size_pct / 2 + Math.random()) * width * (1 - size_pct), (size_pct / 2 + Math.random()) * height * (1 - size_pct));
    while(point.dist(final_pos) < width*size_pct){
        final_pos = createVector((size_pct / 2 + Math.random()) * width * (1 - size_pct), (size_pct / 2 + Math.random()) * height * (1 - size_pct));
    }
    shape = new Draggable(point.x, point.y, width * size_pct, width * size_pct);
}


function drawShapes() {

    textAlign(CENTER);
    textSize(width*0.3);
    fill(90);
    text (''+score,width/2,height/2);

    noStroke();
    fill(120);
    ellipse(final_pos.x, final_pos.y, width * size_pct, width * size_pct);
    fill(120);
    ellipse(point.x, point.y, width * size_pct, width * size_pct);
    
    angleMode(DEGREES);
    push ();
    rectMode(CENTER);
    translate ((point.x+final_pos.x)/2,(point.y+final_pos.y)/2);
    rotate (angle(point.x,point.y,final_pos.x,final_pos.y) );
    fill(120);
    rect(0,0,point.dist(final_pos),width*size_pct);
    pop ();

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