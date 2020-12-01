class DivThing {
  constructor(id,content,x,y,z, parent){
    this.el = document.createElement("div");
    if(id!="") this.el.id=id;
    this.el.innerHTML=content;
    this.el.setAttribute("style",`z-index:10;position:fixed; transform-style:preserve-3d; font-size:40px;`);

    let r = Math.floor(125 +Math.random()*100);
    let g = Math.floor(125 +Math.random()*100);
    let b = Math.floor(125 +Math.random()*100);

    this.el.style.color = `rgba(${r},${g},${b},1)`;
    parent.appendChild(this.el);

    this.x = x;
    this.y = y;
    this.z = z;
    this.text = content;
    this.vel = 6;
    this.count =0;
    this.pushed = false;
    this.fontsize = 40;
    this.force = 6;

    this.update();
  }

  update(){
    let y = this.y;
    let size = Math.floor(this.fontsize);

    this.x += this.force;
    if(this.force>1) this.force -= 0.1;
    this.el.style.fontSize = size+"px";
    this.el.style.transform=`translateX(${this.x}px) translateY(${y}px) translateZ(${this.z}px) rotateX(-90deg)`;
    /* let fact = 125;
    this.color = `rgb(${fact},${fact},${fact})`;
    this.el.style.color = this.color; */
    if(this.fontsize-0.5>10) this.fontsize -= 0.5;
  //  this.el.style.zIndex = 1000-Math.floor(this.z);
  }
}
