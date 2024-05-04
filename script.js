let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener('resize', function(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;  
  centerX = innerWidth / 2;
})

let centerX = innerWidth / 2;

class Line {
  reset() {
    this.speed = 0.3 + Math.random() * 0.3;
    this.color = Math.round(Math.random() * 180);
    this.shadowColor = this.chooseColor(1);
    this.mainColor = this.chooseColor(1);
    this.length = 40 + Math.round(Math.random() * ((Math.max(innerWidth, innerHeight)) / 2));
    this.type = Math.random() < 0.5 ? 0 : 1;
    this.r = this.type == 0 ? -30 : 210;
  }
  move() {
    if (this.r >= 89 && this.r <= 91) {
      this.reset();
    } else {
      if (this.type == 0) {
        this.r += this.speed;
      } else {
        this.r -= this.speed;
      }
    }
  }
  draw() {
    let x = centerX + Math.cos(Math.PI * (this.r / 180)) * this.length;
    let y = innerHeight - Math.sin(Math.PI * (this.r / 180)) * this.length - 100;

    ctx.shadowColor = this.shadowColor;
    ctx.shadowBlur = 50;

    ctx.fillStyle = this.mainColor;
    ctx.beginPath();
    ctx.moveTo(centerX, innerHeight);
    ctx.lineTo(x, y);
    ctx.lineTo(centerX, innerHeight + 40);
    ctx.fill();

  }
  chooseColor(a) {
    return 'hsla(' + this.color + ',100%,80%,' + a + ')';
  }
}

let lines = [];
for (let i = 0; i < 35; i++) {
  lines.push(new Line);
  lines[i].reset();
}

let currentTime = Date.now();

function animate() {
  let frameTime = Date.now();
  if (frameTime - currentTime < 16) {
    window.requestAnimationFrame(animate);
    return;
  }
  frameTime = currentTime;

  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let j = 0; j < lines.length; j++) {
    lines[j].move();
    lines[j].draw();
  }
  window.requestAnimationFrame(animate);
}

animate();