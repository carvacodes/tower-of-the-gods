/*****************************/
/*                           */
/*          Classes          */
/*                           */
/*****************************/

// a helper class to manage the various canvas elements that will be used
class SceneCanvas {
  constructor(elementId) {
    this.canvas = document.getElementById(elementId);   // the HTML document's ID for this canvas
    this.canvas.width = _w;         // sets width and height to
    this.canvas.height = _h;        // match window dimensions

    this.ctx = this.canvas.getContext('2d');  // get a drawing context from the HTML canvas
  }
}

// the rays shooting from the sea
class Ray {
  constructor() {
    this.speed;
    this.color;
    this.mainColor;
    this.length;
    this.type;
    this.r;

    this.reset();
  }

  // this method sets each ray's properties on initialization and whenever the ray has completed a cycle
  reset() {
    this.speed = 0.2 + Math.random() * 0.8;   // the angular velocity of the ray
    this.mainColor = this.chooseColor();      // calls the chooseColor helper to pick a random yellowish hue
    this.length = 80 + Math.round(Math.random() * ((Math.min(_w, _h)) * (2/3)));  // the total length of the ray
    this.type = Math.random() < 0.5 ? 0 : 1;  // a clockwise (1) or counterclockwise (0) ray
    this.r = this.type == 0 ? -10 : 190;      // randomly sets the starting angle based on type
  }

  // rotates each ray based on the amount of time that's passed since the last frame (based on the passed frameSpeedFactor parameter)
  move(frameSpeedFactor) {
    // reset if the ray reaches 90deg in either direction
    if ((this.type == 0 && this.r >= 90) || (this.type == 1 && this.r <= 90)) {
      this.reset();
    } else {
      if (this.type == 0) {
        this.r += this.speed * frameSpeedFactor;
      } else {
        this.r -= this.speed * frameSpeedFactor;
      }
    }
  }

  // draw the ray as a triangle from its root to its maximum length. takes a canvas's drawing context as a parameter.
  draw(ctx) {
    let x = _w / 2 + Math.cos(Math.PI * (this.r / 180)) * this.length;
    let y = _h - Math.sin(Math.PI * (this.r / 180)) * this.length - 100;

    ctx.fillStyle = this.mainColor;
    ctx.beginPath();
    ctx.moveTo(_w / 2, _h * (4/5));
    ctx.lineTo(x, y);
    ctx.lineTo(_w / 2, (_h * (4/5)) + 50);
    ctx.fill();
  }

  // helper method for picking a random yellowish hue
  chooseColor() {
    return `hsl(${90 + Math.round(Math.random() * 90)}, 100%, 85%)`;
  }
}

// the wave class for randomized, bezier-based, triangle-ish waves
class Wave {
  constructor() {
    this.x;
    this.xSpeed;
    this.y;
    this.width;
    this.height;
    this.timer;
    this.timerDir;

    this.reset();
  }

  // moves each wave at a fixed x/y speed based on the amount of time since the last frame (based on the passed frameSpeedFactor parameter)
  move(frameSpeedFactor) {
    this.x += this.xSpeed * frameSpeedFactor;
    this.y -= this.ySpeed * frameSpeedFactor;

    // if the wave's timer reacher below 30, or if it makes it halfway up the screen or more, instantly its values
    if ((this.timer < -30 * frameSpeedFactor) || this.y < _h * 0.5) {
      this.reset();
    }
    
    // reverses the timer at this.width/3, resulting in a wave that grows for the first half of its drawing time and shrinks for the remainder
    if (this.timer >= this.width / 3) {
      this.timerDir = -1;
    }

    // adjust the wave's timer by the framerate-adjusted speed
    this.timer += this.timerDir * frameSpeedFactor * this.timerSpeed;
  }

  // resets the wave's properties
  reset() {
    this.yOffset = Math.round(Math.random() * (_h * (3/7)));  // sets the wave's offset, which is applied to screen height * 4/7 + yOffset
    this.heightFactor = (_h - this.yOffset) / _h;             // lets farther waves appear smaller and last longer
    
    // the timer properties simultaneously control the wave's drawing time and lifetime
    this.timer = 0 - Math.random() * 60;
    this.timerDir = 1;      // controls whether the wave is growing or shrinking
    this.timerSpeed = this.heightFactor;

    this.x = (Math.random() * (_w + 200)) - 100;  // sets the wave's x value to somewhere between to 100 pixels to the left or right max of the screen
    this.y = (_h * (4/7)) + this.yOffset;   // locks the wave to 4/7 or greater of the screen height
    this.xSpeed = 0.66;
    this.ySpeed = this.xSpeed / 4;

    this.width = 150 - (125 * this.heightFactor * this.heightFactor);   // the wave width is a function of its y position (lower == bigger)
    this.height = this.width / 3;

    // instantly retry any wave whose width is negative
    if (this.width < 0) {
      this.reset();
    }
  }

  // draws the wave as two curved-edge triangles: one light (in the back) and one dark (smaller, at bottom front of the wave)
  // takes a canvas's drawing context as a parameter
  draw(ctx) {
    this.height = this.timer * (2/5);
    if (this.timer > 0) {
      // draw light part of wave (the larger part)
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.bezierCurveTo(this.x + this.width / 6, this.y - this.height / 6, this.x + this.width / 3, this.y - this.height / 3, this.x + this.width / 2, this.y - this.height);
      ctx.bezierCurveTo(this.x + this.width * (2 / 3), this.y - this.height / 3, this.x + this.width * (5 / 6), this.y - this.height / 6, this.x + this.width, this.y);
      ctx.lineTo(this.x + this.width / 2, this.y - this.height / 2);
      ctx.fill();

      // draw wave underside (the smaller part, in shadow)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.moveTo(this.x, this.y);
      ctx.bezierCurveTo(this.x + this.width / 6, this.y - this.height / 6, this.x + this.width / 3, this.y - this.height / 3, this.x + this.width / 2, this.y - this.height * (5 / 16));
      ctx.bezierCurveTo(this.x + this.width * (2 / 3), this.y - this.height / 3, this.x + this.width * (5 / 6), this.y - this.height / 6, this.x + this.width, this.y);
      ctx.lineTo(this.x + this.width / 2, this.y - this.height / 2);
      ctx.fill();
    }
  }
}

// a helper/container class to manage cloud cells
class CloudBank {
  constructor() {
    this.rootCells = [];          // contains cloud cells, and is iterated through for positioning and drawing
    
    this.constructCloudBank();    // on instantiation, contruct the cloud bank from individual cells,
    this.draw(cloudCanvas.ctx);   // and draw the entire cloud bank
  }

  // a helper method to quickly regenerate the rootCells array and redraw the cloud bank (called on screen resize)
  recreateCloudBank() {
    this.rootCells = [];        // empty the array
    this.constructCloudBank();  // construct a new set of cloud cells
    this.draw(cloudCanvas.ctx); // draw the cells
  }

  // populates the rootCells array with cloud cell instances
  constructCloudBank() {
    // start with i (the initial x value) as far to the left of the screen as needed to offer some overdraw and a nicer end product
    for (let i = -130 * _scale; i < _w;) {
      // each cell is given a 30 + rand(100) width, scaled to the screen
      let cellOffset = (30 * (_scale * 2)) + Math.round(Math.random() * (100 * (_scale * 2)));
      let newCell = new CloudCell(i + cellOffset, cellOffset);
      this.rootCells.push(newCell);
      i += cellOffset * (0.5);  // this allows for some cloud overlap, again creating a more pleasing visual
    }
  }

  // drawing only occurs on each instantiation of a cloud bank, and iterates through the set of cloud cells three times in total
  // takes a canvas's drawing context as a parameter
  draw(ctx) {
    ctx.clearRect(0, 0, _w, _h);
    // the first pass draws the highest, light gray portion of the cloud
    for (let i = 0; i < this.rootCells.length; i++) {
      let r = this.rootCells[i];
      ctx.fillStyle = 'rgb(220,220,220)';
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.xRadius, r.yRadius, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // pass two draws the solid white main body
    for (let i = 0; i < this.rootCells.length; i++) {
      let r = this.rootCells[i];
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.beginPath();
      ctx.ellipse(r.x, r.y + r.yRadius * (1/15), r.xRadius, r.yRadius * (14/15), 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // pass three draws the lower shadow
    for (let i = 0; i < this.rootCells.length; i++) {
      let r = this.rootCells[i];
      ctx.fillStyle = 'rgb(200,200,200)';
      ctx.beginPath();
      ctx.ellipse(r.x, r.y + (r.yRadius * (5/6)) - (0), r.xRadius, r.yRadius * (1/6), 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// the cloud cells are mainly just helper objects to easily access x/y and radius information
class CloudCell {
  constructor(xPos, xRadius) {
    this.x = xPos;
    this.xRadius = xRadius;
    this.yRadius = xRadius / 2;
    this.y = ((_h / 2) - 10) - this.yRadius;  // cloud cells are always offset from the middle of the screen by 10 pixels up
  }
}

/*****************************/
/*                           */
/*          Globals          */
/*                           */
/*****************************/

// globals to contain the window dimensions
let _w = window.innerWidth;
let _h = window.innerHeight;

// scales the entire scene to match the ideal conditions, as calculated from the original development screen dimensions
let _scale = Math.min(_w / 1500, _h / 950);

// create instances of each canvas, passing the HTML document's IDs for each canvas
let rayCanvas = new SceneCanvas('rayCanvas');
let seaCanvas = new SceneCanvas('seaCanvas');
let cloudCanvas = new SceneCanvas('cloudCanvas');

// populate the waves array
let waves = [];
for (let i = 0; i < Math.round(_scale * 35); i++) {
  waves.push(new Wave());
}

// populate the rays array
let rays = [];
for (let i = 0; i < 35; i++) {
  rays.push(new Ray);
  rays[i].reset();
  let rand = Math.random();
  rays[i].r = rand < 0.5 ? rand * 90 : 180 - (rand * 90);
}

// instantiate a new CloudBank
let clouds = new CloudBank();

// add a listener to redraw and recalculate most of the scene on resize (slightly expensive, but guarantees a good visual on resize)
window.addEventListener('resize', ()=>{
  // reset window dimension/scale vars
  _w = window.innerWidth;
  _h = window.innerHeight;
  _scale = _w / 1500;

  // reset all canvas dimensions
  rayCanvas.canvas.width = _w;
  rayCanvas.canvas.height = _h;
  seaCanvas.canvas.width = _w;
  seaCanvas.canvas.height = _h;
  cloudCanvas.canvas.width = _w;
  cloudCanvas.canvas.height = _h;

  // essentially reinitializes the cloud bank
  clouds.recreateCloudBank();
})

/*****************************************/
/*                                       */
/*          Animation Functions          */
/*                                       */
/*****************************************/

// iterates through the rays array, moving and drawing each ray
function animateRays(frameSpeedFactor) {
  rayCanvas.ctx.clearRect(0, 0, _w, _h);
  for (let j = 0; j < rays.length; j++) {
    rays[j].move(frameSpeedFactor);
    rays[j].draw(rayCanvas.ctx);
  }
}

// iterates through the waves array, moving and drawing each wave
function animateSea(frameSpeedFactor) {
  seaCanvas.ctx.clearRect(0, 0, _w, _h);
  for (let i = 0; i < waves.length; i++) {
    waves[i].move(frameSpeedFactor);
    waves[i].draw(seaCanvas.ctx);
  }
}

// variables to track the time elapsed between each frame
let firstFrameTime = performance.now();
let frameSpeedFactor = 1;
let tempFrameSpeedFactor = 0;

function animateScene(callbackTime) {
  // target 30fps by dividing the monitor's refresh rate by 30 to calculate per-frame movement
  tempFrameSpeedFactor = Math.min(callbackTime - firstFrameTime, 30);   // set a minimum to avoid frame timer buildup when the window is not focused
  firstFrameTime = callbackTime;
  frameSpeedFactor = tempFrameSpeedFactor / 30;
  
  // animate the rays and sea on every frame, passing the calculated frame speed factor to match movement speed at different rAF callback rates
  animateRays(frameSpeedFactor);
  animateSea(frameSpeedFactor);

  window.requestAnimationFrame(animateScene);
}

// init!
window.requestAnimationFrame(animateScene);
