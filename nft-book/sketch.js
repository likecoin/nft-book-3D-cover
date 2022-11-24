let myShader;
let matcap;
let obj;

let bg = [];
let bgIndex;
let watermark = [];

const COLORS = ['gold.jpg', 'red.jpg', 'sliver.png'];
const NUMBER_OF_IMAGE = [9, 99, 999];

const totalTick = 352;
let currentTick = 0;
let capturer;

function preload() {
  myShader = loadShader("shader.vert", "shader.frag");

  bg[0] = loadImage("./01_background/bg-1.jpg")
  bg[1] = loadImage("./01_background/bg-2.jpg")
  bg[2] = loadImage("./01_background/bg-3.jpg")
  const params = new URLSearchParams(window.location.search);
  let colorIndex = params.get('color') || 0;
  matcap = loadImage(`./02_coin-texture/${COLORS[colorIndex]}`);
  watermark[0] = loadImage("./03_watermark/text-1.png")
  watermark[1] = loadImage("./03_watermark/text-2.png")

  obj = loadModel("coin.obj")
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(600, 800, WEBGL);
  noStroke();
  isCentered = random(0, 1) > 0.5
  isMirrored = random(0, 1) > 0.5
  textStyle = Math.floor(random(0, 2));
  bgIndex = Math.floor(random(0, 3));
  randomA = random(0.001, 0.01)
  randomB = random(0.001, 0.01)
  randomC = isMirrored ? -randomA : random(0.001, 0.01)
  randomD = isMirrored ? -randomB : random(0.001, 0.01)
  randomE = isCentered ? 0 : random(-200, 200)
  randomF = isCentered ? 0 : random(-200, 200)
  randomG = isCentered ? 0 : random(-200, 200)
  randomH = isCentered ? 0 : random(-200, 200)
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
  texture(bg[bgIndex]);
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
  translate(randomE, randomF -(100));
  rotateX(currentTick * randomA);
  rotateZ(currentTick * randomB);
  scale(0.83);
  model(obj)
  pop()

  push()
  translate(randomG, randomH + 100);
  rotateX(currentTick * randomC);
  rotateZ(currentTick * randomD);
  scale(0.83);
  model(obj)
  pop()

  push();
  texture(watermark[textStyle]);
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
  let index = params.get('index') || 0;
  let colorIndex = params.get('color') || 0;
  if (index > NUMBER_OF_IMAGE[colorIndex]) {
    colorIndex = Number(colorIndex) + 1;
    if (colorIndex > COLORS.length - 1) return;
    index = -1;
  }
  params.set('index', Number(index) + 1);
  params.set('color', Number(colorIndex));
  params.toString()
  document.location = `?${params.toString()}`;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}