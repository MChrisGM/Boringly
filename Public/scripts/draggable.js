// Click and Drag an object
// Daniel Shiffman <http://www.shiffman.net>

class Draggable {
  constructor(x, y, w, h) {
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  over() {
    // Is mouse over object
    if(createVector(mouseX,mouseY).dist(createVector(this.x,this.y)) < this.w/2) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }

    
  }

  update() {
    // Adjust location if being dragged
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  show() {
    stroke(0);
    // Different fill based on state
    if (this.dragging) {
      fill(255,0,0);
    } else if (this.rollover) {
      fill(255,0,0);
    } else {
      fill(255, 0, 0);
    }
    ellipse(this.x, this.y, this.w, this.h);
  }

  pressed() {
    // Did I click on the rectangle?
    if(createVector(mouseX,mouseY).dist(createVector(this.x,this.y)) < this.w/2) {
      this.dragging = true;
      // If so, keep track of relative location of click to corner of rectangle
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    // Quit dragging
    this.dragging = false;
  }
}