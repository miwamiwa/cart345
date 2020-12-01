window.onload = start;
window.onresize = resizewindow;
const updateInterval = 40;
let channel;
let wordScene;
let waterScene;
let words = [];

let width = 200;
let height = 200;
let counter =0;
const minMessages = 50;
const minSentences = 10;

let spawnArea = {
  x: -150,
  y: 40,
  z: 400,
  x2: -50,
  y2: height-50,
  z2: 300
}

let water;
let perspective;
let queue = [];

let sliceCanvas;
let sliceCtx;
let talkbox;
let inputbox;
let markov;
let sentenceCount =0;
let bg;
let outputarea;
let cloudImg;

let userInputBox;

let startTalkEl;
let stopTalkEl;
let startListenEl;
let stopListenEl;
let connectinputEl;
let connectagainEl;

let connected = false;
let talkready = false;
let connectInfo;
let memobox;

let cloudX = 55;
let cloudY = 55;

function start(){
  memobox = document.getElementById("memorybox");
  connectInfo = document.getElementById("connectioninfo");
  startTalkEl = document.getElementById("starttalking");
  stopTalkEl=document.getElementById("stoptalking");
  startListenEl=document.getElementById("startlistening");
  stopListenEl=document.getElementById("stoplistening");
  connectinputEl=document.getElementById("connectinput");
  connectagainEl=document.getElementById("connectagain");

  userInputBox = document.getElementById("userinputs");
  cloudImg = document.getElementById("cloudimg");
  outputarea = document.getElementById("output");

  markov = new RiMarkov(2,true,false);
  wordScene = document.getElementById("wordScene");
  waterScene = document.getElementById("waterScene");
  water = new RippleEffect(width,height);

  let bg = document.getElementById("bgimg");
  let bg2 = document.getElementById("bgimg2");

  bg.setAttribute("style",`
    position:fixed;
    left:-15px; top:-304px;
    width:800px; height:800px;
    z-index:0; transform: translateZ(-100px);
  `);

  bg2.setAttribute("style",`
    position:fixed;
    left:-15px; top:-304px;
    width:800px; height:800px;
    z-index:1; transform: translateZ(-100px);
  `);

  sliceCanvas = document.createElement("canvas");
  sliceCanvas.setAttribute("width",width);
  sliceCanvas.setAttribute("height",height);
  sliceCtx = sliceCanvas.getContext("2d");

  inputbox = makeBox(50,50,400,50,'lightblue');
  inputbox.style.visibility='hidden';

  talkbox = makeBox(515,100,320,60,'#fff0', document.body);
  talkbox.style.overflowY='hidden';
  talkbox.style.fontSize='20px';
  talkbox.style.height='auto';
  talkbox.style.maxHeight='150px';
  talkbox.style.textAlign='center';


  setInterval(update,updateInterval);

  resizewindow();
}

let isThinking = true;
function formkeypress(){
  if(event.key=='Enter') submitform();
}

function stoplistening(){
  isThinking =false;
  startListenEl.hidden = false;
  stopListenEl.hidden = true;
}

function startlistening(){
  isThinking = true;
  startListenEl.hidden = true;
  stopListenEl.hidden = false;
}

function starttalking(){
  isTalking = true;
  startTalkEl.hidden = true;
  stopTalkEl.hidden = false;
  if(markov.ready()) generateText();
}


//let inputscounter =0;
function clearit(){
  totalWords =0;
  document.getElementById('wordcount').innerHTML = "no memory";
  markov = new RiMarkov(2,true,false);
  stoptalking();
  talkready = false;
  startTalkEl.hidden = true;
}

function stoptalking(){
  isTalking = false;
  startTalkEl.hidden = false;
  stopTalkEl.hidden = true;
  talkbox.innerHTML = "";
  document.getElementById("bubbleimg").hidden = true;
}

function connectagain(){
  memobox.hidden = true;
  connectInfo.innerHTML = "";
  document.getElementById("bubbleimg").hidden = true;
  stoptalking();
  connectagainEl.hidden = true;
  startTalkEl.hidden = true;
  stopTalkEl.hidden = true;
  startListenEl.hidden = true;
  stopListenEl.hidden = true;
  connectinputEl.hidden = false;
  isTalking = false;
  isListening = false;
}

function submitform(){
  talkready = false;

  let input= document.getElementById('forminput');
  channel = input.value;
  connectInfo.innerHTML = "connected to: "+channel;
  totalWords =0;
  isTalking = false;
  isThinking = false;
  connectagainEl.hidden = false;
  connectinputEl.hidden = true;
  startListenEl.hidden = false;
  connected = true;

  options = {
    options: {
      // Debugging information will be outputted to the console.
      debug: true
    },
    connection: {
      reconnect: true,
      secure: true
    },
    // If you want to connect as a certain user, provide an identity here:
    // identity: {
    //   username: 'Schmoopiie',
    //   password: 'oauth:a29b68aede41e25179a66c5978b21437',
    // },
    channels: [`#${channel}`]
  };

  client = new TwitchJS.client(options);

  // Add listeners for events, e.g. a chat event.
  client.on('chat', (channel, userstate, message, self) => {
    if(isThinking){
      // You can do something with the chat message here ...
      wobbleCloud();
      let rawmessage = message;
      message = message.toLowerCase();
      message = removePunctuation(message);
      msg = message.split(" ");

      totalMessages++;
      totalWords += msg.length;
      document.getElementById('wordcount').innerHTML = totalWords+" words in memory"
      receiveMessage( userstate.username, rawmessage, msg );
    }
  });

  client.connect(); // connect to the Twitch channel.
}

function mouseinstructions(){
  document.getElementById("instructionContent").hidden=false;
  document.getElementById("instructionHoverable").hidden=true;
}

function mouseinstructionsOut(){
  document.getElementById("instructionContent").hidden=true;
  document.getElementById("instructionHoverable").hidden=false;
}
function resizewindow(){
  let scale = 0.5;

  outputarea.style.transform = `scale(${scale}, ${scale})`;
}

let cloudXcounter =0;
let cloudYcounter =2;

function update(){

if(Math.random()<0.4) cloudXcounter += 0.3;
else cloudXcounter += 0.2;
if(Math.random()<0.4) cloudYcounter += 0.3;
else cloudYcounter += 0.2;
cloudX = Math.floor(55 + Math.sin(cloudXcounter)*3);
cloudY = Math.floor(55 + Math.sin(cloudYcounter)*3);
cloudImg.style.left = cloudX+'px';
cloudImg.style.top = cloudY+'px';


  // update falling words
for(let i=words.length-1; i>=0; i--){
  words[i].z-=words[i].vel;
  words[i].update();

  if(words[i].z<10){
    words[i].z =10;
    if(!words[i].pushed){
      queue.push({
        text:words[i].text,
        x:words[i].x,
        y:words[i].y,
        z:words[i].z,
        count:0
      });
      words[i].pushed=true;
    }

    words[i].count++;
    words[i].el.style.opacity = 1-(words[i].count/5);
    if(words[i].count>5){
      words[i].el.remove();
      words.splice(i,1);
    }

  }
}

// update queue
if(queue.length>0){
  drawSlice(queue[0]);

}
if(queue.length>0){
  for(let i=Math.min(queue.length-1,16); i>=0; i--){
    drawSlice(queue[i]);
    queue[i].count++;
    if(queue[i].count==5) queue.splice(i,1);
  }
}

//console.log(queue.length )

water.update();

if(counter%130==0&&markov.ready()){
  generateText();
}
counter++;

if(markov.ready()&&connected&&!talkready){
  talkready = true;
  startTalkEl.hidden = false;
}

if(wobbleEnabled){
  cloudImg.style.transform = 'rotate(0deg)';
}
}

let isTalking = false;
function generateText(){

  if(isTalking){
    document.getElementById("bubbleimg").hidden = false;
    let result = markov.generateSentences(1);

    talkbox.innerHTML = result.join(" ");
  }

}




function drawSlice(input){
  sliceCtx.clearRect(0,0,width,height);
  sliceCtx.fillStyle="black";
  sliceCtx.font = "10px Georgia";
  sliceCtx.fillText(
    input.text,
    scaleTo100(input.x,0,200),
    scaleTo100(input.y,0,200)
  );

  let imageData = sliceCtx.getImageData(0, 0, width,height);
  let slicedata = imageData.data;
//console.log(slicedata.length)
  let counter2 =0;
  for(let i=0; i<slicedata.length; i+=4){
    if(slicedata[i+3]==255){
      let index = i/4;
      let x = index%width;
      let y = Math.floor(index/width);

      water.previous[x][y] = water.brushval;
      counter2++;
  //
    }
  //   console.log(counter2);
  }
}

function scaleTo100(input,x,x2){
  let result = Math.floor(width*input/(x2-x));
  return result;
}

let wordsSoFar = [];
let textSoFar = "";
function receiveMessage(name,rawMessage,arrayMessage){


  console.log("YAAAAAAAAAAA")

  let isLink = false;
  let arrayLessLinks = [];
  let capitalized = false;
  for(let i=0; i<arrayMessage.length; i++){
    let slashCount =0;
    for(let j=0; j<arrayMessage[i].length; j++){
      if(arrayMessage[i][j]=="/") slashCount ++;
    }
    if(slashCount<2){

      for(let j=0; j<arrayMessage[i].length; j++){
        let cc = arrayMessage[i].charCodeAt(j);
        if(!capitalized&&((cc>=65&&cc<=90)||(cc>=97&&cc<=122))){
          arrayMessage[i] = arrayMessage[i].charAt(j).toUpperCase() + arrayMessage[i].slice(1);
          capitalized = true;
        }
      }
      arrayLessLinks.push(arrayMessage[i]);
      //wordsSoFar.push(arrayMessage[i]);
    }
  }
  let messageLessLinks = arrayLessLinks.join(" ");
  let lChar = messageLessLinks[messageLessLinks.length-1];
  if(lChar!="."&&lChar!="?"&&lChar!="") messageLessLinks += ". ";
  textSoFar += messageLessLinks;
  //console.log(messageLessLinks);
  memobox.hidden = false;
  markov.loadText( messageLessLinks );
  console.log("MODEL SIZE: "+markov.size());
  inputbox.innerHTML = messageLessLinks;


  for(let i=0; i<arrayMessage.length; i++){

    words.push( new DivThing(
      totalMessages+" "+i,
      arrayMessage[i],
      rand(spawnArea.x,spawnArea.x2),
      rand(spawnArea.y,spawnArea.y2),
      rand(spawnArea.z,spawnArea.z2),
      wordScene
    ));
  }
}


function removePunctuation(input){
  return input.replace(/[.,\/#!?@$%\^&\*;:{}=\-_"`'~()]/g,"");
}

function rand(min,max){
  if(max==undefined){
    max = min;
    min = 0;
  }
  return min+Math.random()*(max-min);
}

function makeBox(x,y,w,h,c,parent){
  let result = document.createElement("div");
  result.setAttribute("style",`
  position:fixed;
  width: ${w}px;
  height: ${h}px;
  background-color:${c};
  top:${y}px;
  left:${x}px;
  `);
  if(parent==undefined)
    outputarea.appendChild(result);
  else parent.appendChild(result);
  return result;
}

let wobbleEnabled = true;
let angle2;

function wobbleCloud(){

  if(wobbleEnabled){

    angle2 = Math.floor(Math.random()*360);
    wub();

    // setup next wobble
    wobbleEnabled = false;
    setTimeout(function(){wobbleEnabled=true;},400);

    setTimeout(wub,100);
    setTimeout(wub,200);
    setTimeout(wub,300);
  }
}

function wub(){
  let angle = Math.floor(-5+Math.random()*10);
  angle2+=25;
  console.log(angle);
  cloudImg.style.display='block';
  cloudImg.style.transform = `rotate(${angle}deg)`;
  cloudImg.style.filter= `sepia(100%) saturate(300%) brightness(70%) hue-rotate(${angle2}deg)`;
  console.log(cloudImg);
}
