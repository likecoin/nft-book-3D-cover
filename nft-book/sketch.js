let myShader;
let matcap;
let obj;

let bg;
let watermark;

const NUMBER_OF_IMAGE = 1000;
const totalTick = 352;
let currentTick = 0;
let capturer;

function preload() {
  myShader = loadShader("shader.vert", "shader.frag");

  bg = loadImage("./01_background/bg-1.jpg")
  matcap = loadImage("./02_coin-texture/sliver.png");
  watermark = loadImage("./03_watermark/text-1.png")

  obj = loadModel("coin.obj")
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(600, 800, WEBGL);
  noStroke();

  randomA = random(0.001, 0.01)
  randomB = random(0.001, 0.01)
  randomC = random(0.001, 0.01)
  randomD = random(0.001, 0.01)
  capturer = new CCapture({
    framerate: 12,
    format: "webm",
    // If you want to export GIF:
    // framerate: 60,
    // format: "gif",
    // workersPath: "./worker/",
    // verbose: true,
  });
  capturer.start()
}

function draw() {
  background(0, 0, 0, 1);
  push();
  texture(bg);
  translate(0, 0, -300);
  scale(1.45);
  plane(600, 800);
  pop();

  currentTick = deltaTime / 16.6 + currentTick;

  // shader() sets the active shader with our shader
  shader(myShader);
  // Send the texture to the shader
  myShader.setUniform("uMatcapTexture", matcap);

  push()
  translate(0, -(100));
  rotateX(currentTick * randomA);
  rotateZ(currentTick * randomB);
  scale(0.83);
  model(obj)
  pop()

  push()
  translate(0, 100);
  rotateX(currentTick * randomC);
  rotateZ(currentTick * randomD);
  scale(0.83);
  model(obj)
  pop()

  push();
  texture(watermark);
  translate(0, 0, 300);
  scale(0.55);
  plane(600, 800);
  pop();

  if (currentTick < totalTick) {
    capturer.capture(canvas);
  } else if (currentTick >= totalTick) {
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    noLoop();
    nextIndex();
    return;
  }
}

function nextIndex() {
  const params = new URLSearchParams(window.location.search);
  const index = params.get('index') || 0
  if (index > NUMBER_OF_IMAGE) return;
  params.set('index', Number(index) + 1);
  params.toString()
  document.location = `?${params.toString()}`;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}