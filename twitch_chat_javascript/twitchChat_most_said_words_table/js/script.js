let words = [];
let counters = [];
let msg = [];
let voices = [];

let totalMessages =0;
let totalWords =0;

// To get started with this example, specify a channel with which to connect.
const channel = "loltyler1";

    // In this example, TwitchJS is included via a <script /> tag, so we can access
    // the library from window.
    const TwitchJS = window.TwitchJS;

    // Define client options.
    var options = {
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

    const client = new TwitchJS.client(options);

    // Add listeners for events, e.g. a chat event.
    client.on('chat', (channel, userstate, message, self) => {
      // You can do something with the chat message here ...
      if(jQuery.inArray(userstate.username, voices)===-1) voices.push(userstate.username)
      totalMessages++;
      message = message.toLowerCase();
      message = message.replace(/[.,\/#!?@$%\^&\*;:{}=\-_"`'~()]/g,"");
      msg = split(message, " ");
      totalWords += msg.length;

      for (let i=0; i< msg.length; i++){

        if(jQuery.inArray(msg[i], words)<0){
          words.push(msg[i]);

          counters.push(1);
        //  console.log("new")
        }
        else {
          let position = jQuery.inArray(msg[i], words);
          counters[ position ] +=1;
          let placed = false;

          while(position!=0 && !placed){
            if(counters[position]>counters[position-1]){
              let a = counters[position-1];
              counters[position-1] = counters[i];
              counters[position] = a;

              let b = words[position-1];
              words[position-1] = words[position];
              words[position] = b;

              position --;
            }
            else if(position!=counters.length-1&& counters[position]<counters[position+1]){
              let a = counters[position+1];
              counters[position+1] = counters[i];
              counters[position] = a;

              let b = words[position+1];
              words[position+1] = words[position];
              words[position] = b;

              position ++;
            }
            else {
              placed = true;
            }
          }
        //  console.log("old")
        }
      }
    });

    // Finally, connect to the Twitch channel.
    client.connect();

    function setup(){
      createCanvas(1200, 2000);

    }

    function draw(){

      background(235);

        let xSpace = 50;
        let ySpace = 25;
        let spaces = ((width-100)/(xSpace));
        let totalCount = 0;
        let maxi = max(counters);
        for(let i=0; i<counters.length; i++){
          totalCount += counters[i];
        }
        let average = totalCount/counters.length;

      if( words.length>0){

        for(let i=0; i<words.length; i++){

          strokeWeight(3);
          stroke(255, 145);
          fill(235);
          rect( i*xSpace-floor(i/spaces)*(width-100), floor(i/spaces)*ySpace, xSpace, ySpace);

          let val = counters[i]/maxi;

          if (counters[i]===1)  fill(185);
          else if(counters[i]>1 && val<=0.33) fill(185, 185,  map(val, 0, 0.33, 185, 45));
          else if(val>0.33 && val<=0.66) fill(185, map(val, 0.33, 0.66,185, 45), 45);
          else if(val>0.66 && val<=0.92) fill( map(val, 0.33, 1,185, 45), 45, 45);
          else if(val>0.92 && val <=1) fill(15);


          noStroke();
          textSize(10);
          text(words[i], 2+i*xSpace-floor(i/spaces)*(width-100), 10+ floor(i/spaces)*ySpace);
          textSize(16);
          text(counters[i], i*xSpace-floor(i/spaces)*(width-100), 10+ floor(i/spaces)*ySpace+ySpace/2+2)
        }
      }

      noStroke();
      fill(255);
      rect(500, 500, 150, 80);
      fill(0);
      textSize(12);
      text("messages: "+totalMessages,504, 500+45);
      text("words: "+totalWords, 504, 500+15);
      text("unique words: "+words.length, 504, 500+30);
      text("users: "+voices.length,504, 500+60);
    }
