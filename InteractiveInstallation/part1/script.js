window.onload = start;
window.onkeydown=keyDown;
window.onkeyup=keyUp;


// CODE IS BASED ON THIS CSS 3D EXAMPLE:
// https://xem.github.io/CSS3D/
// ... THANKS, GUY!

let scene;
let camera;

let phrase = "Now perhaps we are reaching the elephant in the room, which is that today I've been staring a lot at the same point in space as yesterday, the months before, the months to come.";
let boxCount = 50;
let boxPositions = [];
let phraseStart =0;

let camPose = {
  x:0,
  y:-50,
  r:-50,
  r2:0
}

let camVel = {
  x: 1,
  y: 1,
  r: 1
}
let keyPressed = {
  left:false,
  right:false
}

function start(){

  let scenePointer = document.getElementsByClassName("scene");
  scene = scenePointer[0];

  let camPointer = document.getElementsByClassName("camera");
  camera = camPointer[0];

  let splitPhrase = phrase.split(" ");

  for(let i=0; i<boxCount; i++){

    let posFound = false;
    let pos = {x:0,y:0,z:0};
    let gridScale = 15;
    let gridMax = 10;

    while(!posFound){
      pos.x = Math.floor( gridScale* (-gridMax/2 + Math.random()*gridMax) );
      pos.y = Math.floor( gridScale* (-gridMax/2 + Math.random()*gridMax) );
      pos.z = Math.floor( gridScale* (-gridMax/2 + Math.random()*gridMax) );

      let good = true;
      for(let j=0; j<boxPositions.length; j++){
        if(boxPositions[i].x==pos.x&&boxPositions[i].y==pos.y&&boxPositions[i].z==pos.z){
          good=false;
        }
      }

      if(good) posFound=true;
    }

    let phraseLength = Math.floor( Math.random() * ( splitPhrase.length - phraseStart ) );

    let words = [];
    for(let j=0; j<6; j++){
      if(j<phraseLength) words.push(splitPhrase[phraseStart+j]);
      else words.push("");
    }

    let startRot = {
      x: 90*( -1 + Math.floor( Math.random() * 3 )),
      y: 90*( -1 + Math.floor( Math.random() * 3 ))
    }
    createBox( pos.x,pos.y,pos.z, words, startRot );
    phraseStart = ( phraseStart+6 )%splitPhrase.length;
    console.log(phraseStart,splitPhrase.length)
  }



  setInterval(update, 33);
}

function update(){

  if(keyPressed.left) camPose.x -= camVel.x;
  else if(keyPressed.right) camPose.x += camVel.x;

  if(keyPressed.up) camPose.y -= camVel.y;
  else if(keyPressed.down) camPose.y += camVel.y;

  camera.style.transform = `translateX(${camPose.x}vmin) translateY(${camPose.y}vmin) rotateY(${camPose.r}deg) rotateZ(${camPose.r2}deg)`;
}

function createBox( x,y,z, textArray, initRot){

  let result = document.createElement("div");
  let t = `${textArray[0]}<br>${textArray[1]}<br>${textArray[2]}<br>${textArray[3]}<br>${textArray[4]}<br>${textArray[5]}`;
  result.innerHTML = `<p class="face top">  ${t}  </p>
    <p class="face left">  ${t} </p>
    <p class="face right"> ${t} </p>
    <p class="face front"> ${t} </p>
    <p class="face back">  ${t} </p>
    <p class="face bottom"> ${t} </p>`;

  result.setAttribute("class", "cube");
  result.setAttribute("style", `transform: rotateX(${initRot.x}deg) rotateY(${initRot.y}deg) translateX(${x}vmin) translateY(${y}vmin) translateZ(${z}vmin)`);
  scene.appendChild(result);
}

function keyDown(e){
  console.log(e.keyCode);
  switch(e.keyCode){
    // LRUD
    case 37: keyPressed.left=true; break;
    case 39: keyPressed.right=true; break;
    case 38: keyPressed.up=true; break;
    case 40: keyPressed.down=true; break;
    // WASD
    case 65: keyPressed.left=true; break;
    case 68: keyPressed.right=true; break;
    case 87: keyPressed.up=true; break;
    case 83: keyPressed.down=true; break;
  }
}

function keyUp(e){
  switch(e.keyCode){
    case 37: keyPressed.left=false; break;
    case 39: keyPressed.right=false; break;
    case 38: keyPressed.up=false; break;
    case 40: keyPressed.down=false; break;

    case 65: keyPressed.left=false; break;
    case 68: keyPressed.right=false; break;
    case 87: keyPressed.up=false; break;
    case 83: keyPressed.down=false; break;
  }
}
