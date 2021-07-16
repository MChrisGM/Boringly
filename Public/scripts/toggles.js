class Toggle{
    constructor(pos,size,onClick){
        this.pos = pos;
        this.size = size;
        this.onClick = onClick;

        if(this.pos != null){
            this.onCall();
        }
    }
    onCall(){

    }
    display(){
        rectMode(CENTER);
        push ();
        translate (this.pos.x,this.pos.y);
        rect(0,0,this.size.x,this.size.y);
        pop ();
    }
}