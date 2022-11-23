let myShader;
let matcap;
let obj;

let bg;
let watermark;

const captureLength = 300


function preload() {
  myShader = loadShader("shader.vert", "shader.frag");

  bg = loadImage("./01_background/bg-1.jpg")
  matcap = loadImage("./02_coin-texture/sliver.jpg");
  watermark = loadImage("./03_watermark/text-1.png")

  obj = loadModel("coin.obj")
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(600, 800, WEBGL);
  noStroke();

  randomA = random(0.001,0.01)
  randomB = random(0.001,0.01)
  randomC = random(0.001,0.01)
  randomD = random(0.001,0.01)

  capturer.start()
}

function draw() {
  background(0,0,0,1);
  push();
  texture(bg);
  translate(0,0,-300);
  scale(1.45);
  plane(600, 800);
  pop();

  // shader() sets the active shader with our shader
  shader(myShader);
  // Send the texture to the shader
  myShader.setUniform("uMatcapTexture", matcap);

  push()
  translate(0,-(100));
  rotateX(frameCount * randomA);
  rotateZ(frameCount * randomB);
  scale(0.83);
  model(obj)
  pop()

  push()
  translate(0,100);
  rotateX(frameCount * randomC);
  rotateZ(frameCount * randomD);
  scale(0.83);
  model(obj)
  pop()

  push();
  texture(watermark);
  translate(0,0,300);
  scale(0.55);
  plane(600, 800);
  pop();

  if(frameCount < captureLength){
    capturer.capture(canvas);
  }else if (frameCount === captureLength){
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}