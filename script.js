var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener('resize', function(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;  
  centerX = innerWidth / 2;
  centerY = innerHeight / 2;
})

var centerX = innerWidth / 2,
    centerY = innerHeight / 2;

function Line(){}

Line.prototype.reset = function(){
  this.speed = 0.3 + Math.random() * 0.3;
  this.color = Math.round(Math.random() * 180);
  this.shadowColor = this.chooseColor(1);
  this.mainColor = this.chooseColor(1);
  this.length = 40 + Math.round(Math.random() * ((innerWidth - 100) / 2));
  this.type = Math.random() < 0.5 ? 0 : 1;
  this.r = this.type == 0 ? -30 : 210;
};

Line.prototype.move = function(){
  if (this.r >= 89 && this.r <= 91) {
    this.reset();
  } else {
    if (this.type == 0) {
      this.r += this.speed;
    } else {
      this.r -= this.speed;
    }
  }
};

Line.prototype.draw = function(){
  var x = centerX + Math.cos(Math.PI * (this.r / 180)) * this.length;
  var y = innerHeight - Math.sin(Math.PI * (this.r / 180)) * this.length;
  
  ctx.shadowColor = this.shadowColor;
  ctx.shadowBlur = 50;
  
  ctx.fillStyle = this.mainColor;
  ctx.beginPath();
  ctx.moveTo(centerX, innerHeight);
  ctx.lineTo(x, y);
  ctx.lineTo(centerX, innerHeight + 40);
  ctx.fill();
  
};

Line.prototype.chooseColor = function(a){
  return 'hsla(' + this.color + ',100%,80%,' + a + ')';
};

var lines = [];
for (var i = 0; i < 35; i++) {
  lines.push(new Line);
  lines[i].reset();
}

function animate() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (var j = 0; j < lines.length; j++) {
    lines[j].move();
    lines[j].draw();
  }
  requestAnimationFrame(animate);
}

animate();