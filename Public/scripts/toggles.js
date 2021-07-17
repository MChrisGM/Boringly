class Toggle {
    constructor(name, pos, size, state, onClick, mode, options) {
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.state = state;
        this.onClick = onClick;
        this.mode = mode;
        this.options = options;
        this.output = '';
    }

    onCall() {
        if (this.mode == 'toggle') {
            if (mouseX > this.pos.x - this.size.x / 2 && mouseX < this.pos.x + this.size.x / 2) {
                if (mouseY > this.pos.y - this.size.y / 2 && mouseY < this.pos.y + this.size.y / 2) {
                    if (this.onClick != undefined) {
                        this.onClick();
                    }
                }
            }
        }else if(this.mode == 'options'){
            let w = this.size.x / this.options.length;
            let l = findLongest(this.options) || 2;
            let s = w/l;
            for(let i=0; i<this.options.length;i++){
                if (mouseX > this.pos.x - this.size.x/2 + (w*i) - s && mouseX < this.pos.x - this.size.x / 2 + (w*i) + w - s) {
                    if (mouseY > this.pos.y - this.size.y / 2 && mouseY < this.pos.y + this.size.y / 2) {
                        if (this.onClick != undefined) {
                            this.output = i;
                            this.onClick();
                        }
                    }
                }
            }
        }
    }

    display() {
        if (this.mode == 'toggle') {
            rectMode(CENTER);
            push();
            translate(this.pos.x, this.pos.y);
            fill(210);
            stroke(255);
            strokeWeight(4);
            rect(0, 0, this.size.x, this.size.y, 20);
            strokeWeight(1);
            if (this.state) {
                fill(95, 201, 68);
                stroke(95, 201, 68);
                rect(this.size.x / 4, 0, this.size.x / 2, this.size.y, 20);
            } else {
                fill(128, 128, 128);
                stroke(128, 128, 128);
                rect(-this.size.x / 4, 0, this.size.x / 2, this.size.y, 20);
            }
            pop();
            
        }else if(this.mode == 'options'){
            let w = this.size.x / this.options.length;
            let l = findLongest(this.options) || 2;
            let s = w/l;
            for(let i=0;i<this.options.length;i++){
                textAlign(CENTER);
                textSize(s*2);
                fill(160);
                if(i == this.state){
                    fill(255);
                }
                text(''+this.options[i],this.pos.x - this.size.x/2 + w*i,this.pos.y+s);
            }
        }
        return this;
    }
}