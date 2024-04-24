let seed = 239;
let cloudSpeed = 0.5; 

const skyColor = "#A0AFFF";
const cloudColor = "#ffffff";
const moonColor = "#f0f0f0";
const starColor = "#ffffff";
const numTwinklingStars = 100;
const numPlusStars = 50; // 

let shootingStars = [];
let button;

function setup() {
  createCanvas(400, 400);
  button = createButton("reimagine");
  button.mousePressed(() => {
    seed++;
    shootingStars = []; 
  });
}

function draw() {
  randomSeed(seed);

  drawGradientBackground("#A0AFFF", "#C096FF");
  noStroke();
  drawMoon(width * 0.7, height * 0.3, width / 10, random(0, TWO_PI));
  drawTwinklingStars(numTwinklingStars);
  drawPlusStars(numPlusStars);
  drawClouds(random(3, 7));

  
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    shootingStars[i].update();
    shootingStars[i].display();
    if (shootingStars[i].transparency <= 0) {
      shootingStars.splice(i, 1); 
    }
  }
}

function drawGradientBackground(color1, color2) {
  for (let y = 0; y < height; y++) {
    let interColor = lerpColor(color(color1), color(color2), y / height);
    stroke(interColor);
    line(0, y, width, y);
  }
}

function drawMoon(x, y, size, phase) {
  fill(moonColor);
  ellipse(x, y, size);

  // Draw moon craters or features based on phase, this doesn't work though
  if (phase < PI) {
    // Draw craters on left side
    ellipse(x - size * 0.2, y - size * 0.1, size * 0.3);
    ellipse(x - size * 0.1, y + size * 0.1, size * 0.2);
  } else {
    // Draw craters on right side
    ellipse(x + size * 0.2, y - size * 0.1, size * 0.3);
    ellipse(x + size * 0.1, y + size * 0.1, size * 0.2);
  }
}

function drawTwinklingStars(numStars) {
  fill(starColor);
  for (let i = 0; i < numStars; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 3);
    let opacity = random(150, 255); 
    fill(255, 255, 255, opacity);
    ellipse(x, y, size);
  }
}

function drawPlusStars(numStars) {
  fill(starColor);
  for (let i = 0; i < numStars; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 3);
    let opacity = random(50, 100); 
    fill(255, 255, 255, opacity);
  
    rect(x - size / 2, y - size / 10, size, size / 5);
    rect(x - size / 10, y - size / 2, size / 5, size);
  }
}
function drawClouds(numClouds) {
  for (let i = 0; i < numClouds; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(50, 150);
   
    let drift = (frameCount * cloudSpeed * 0.1) % width; // Adjust multiplier for speed and wrap around at canvas width

  
    fill(cloudColor);
    ellipse((x + drift) % width, y, size); 

    let pinkish = color(255, 192, 203); 
    let white = color(255); 
    let cloudBottomY = y + size / 5;
    let startX = (x - size / 2 + drift) % width; // Leftmost x-coordinate of the cloud
    let endX = (x + size / 2 + drift) % width; // Rightmost x-coordinate of the cloud
    let step = (endX - startX) / 100; 
    for (let tx = startX; tx <= endX; tx += step) {
      let gradient = map(tx, startX, endX, 0, 1);
      let interColor = lerpColor(white, pinkish, gradient);
      fill(interColor);
      ellipse(tx, cloudBottomY, size); 
    }

    let numOvals = random(3, 6); 
    for (let j = 0; j < numOvals; j++) {
      let ovalX = random(x - size / 2, x + size / 2);
      let ovalY = random(y - size / 10, y + size / 5);
      let ovalSize = random(size * 0.4, size * 0.8);
      let ovalWidth = ovalSize * random(0.6, 1);
      let ovalHeight = ovalSize * random(0.5, 0.8);
      ellipse((ovalX + drift) % width, ovalY, ovalWidth, ovalHeight);
    }
  }
}
class ShootingStar {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.transparency = 255;
    this.angle = random(TWO_PI); 
    this.rotationSpeed = 0.05; 
  }

  update() {
    this.angle += this.rotationSpeed; 
    if (this.angle > TWO_PI) {
      this.angle -= TWO_PI; 
    }
    this.transparency -= 2; 
  }

  display() {
    fill(255, 255, 255, this.transparency);
    push(); 
    translate(this.x, this.y);
    rotate(this.angle);
    star(0, 0, 3, 7, 5); 
    pop();
  }
}


function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function mouseClicked() {
  shootingStars.push(new ShootingStar(mouseX, mouseY));
}
