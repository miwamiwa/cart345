
// code based on this Coding Train video:
// https://www.youtube.com/watch?v=BZUdGqeOD0w

class RippleEffect {
  constructor(cols,rows){

    this.startval = 0;
    this.brushval = 150;

    this.damping = 0.98;
    this.cols=cols;
    this.rows=rows;
    this.current = [];
    this.previous = [];
    this.visible = [];
    this.radius = 92;


    for(let i=0; i<cols; i++){
      this.current[i] = [];
      this.previous[i] = [];
      this.visible[i] = [];

      for(let j=0; j<rows; j++){
        this.current[i][j] = this.startval;
        this.previous[i][j] = this.startval;

        this.visible[i][j] = false;
        if(Math.sqrt(Math.pow(width/2-i,2)+Math.pow(height/2-j,2))<this.radius){
          this.visible[i][j] = true;
        }
      }
    }

    this.counter = 0;
    this.outMin = 0;
    this.outMax = 255;

    this.canvas = document.createElement("canvas");
    waterScene.appendChild(this.canvas);

    this.canvas.setAttribute("width",cols);
    this.canvas.setAttribute("height",rows);
    this.canvas.setAttribute("style",`
    width:${width}px;height:${height}px;
    transform-style: preserve-3d; position: fixed;
    transform:rotateX(0deg);`);
    this.ctx = this.canvas.getContext("2d");

    // start the ripple
    this.previous[Math.floor(cols/2)][Math.floor(rows/2)] = this.brushval;
  }

  update(){


    let dataCount =0;
    let color;
    let imageData = this.ctx.getImageData(0, 0, this.cols, this.rows);

    let newFrame = imageData.data;

    for(let i=1; i<this.cols-1; i++)
    {
      for(let j=1; j<this.rows-1; j++)
      {
        if(this.visible[i][j]){
          this.current[i][j] =
          ( this.previous[i - 1][j]
            + this.previous[i + 1][j]
            + this.previous[i][j - 1]
            + this.previous[i][j + 1] ) / 2 - this.current[i][j];
            this.current[i][j] = (this.current[i][j] * this.damping);
            dataCount = 4*(j*this.cols+i);
            color = Math.floor(this.outMin+(this.outMax-this.outMin)*( this.current[i][j] )/255);
            newFrame[dataCount] = color;
            newFrame[dataCount+1] = color;
            newFrame[dataCount+2] = color;
            newFrame[dataCount+3] = 255;
        }


        }
      }

    this.ctx.putImageData(imageData, 0, 0);


      let temp = [];

      for(let i=0; i<this.cols; i++){
        temp[i] = [];

        for(let j=0; j<this.rows; j++){
          temp[i][j] = this.previous[i][j];
          this.previous[i][j] = this.current[i][j];
          this.current[i][j] = temp[i][j];
        }
      }
  }

}
