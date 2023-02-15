import fs from "fs";
const basePath = process.cwd();

fs.writeFileSync(`${basePath}/output/json/_metadata.json`, "");
const writer = fs.createWriteStream(`${basePath}/output/json/_metadata.json`, {
  flags: "a",
});

writer.write("[");
const readDir = `${basePath}/output/json`;
const files = fs.readdirSync(readDir);

function formatIdentity(fileName) {
  let color;
  if (fileName.includes("gold")) {
    color = "Gold";
  }
  if (fileName.includes("sliver")) {
    color = "Sliver";
  }
  if (fileName.includes("red")) {
    color = "Rose Gold";
  }
  return color;
}

function formatCoinLayout(obj) {
  let position;
  if (obj.isCentered) {
    position = "Standard";
  } else if (obj.isMirrored) {
    position = "Mirror";
  } else {
    position = "Random";
  }
  return position;
}

function formatLayout(style) {
  switch (style) {
    case 0:
      return "Kitty-Corner";
    case 1:
      return "Bottom";
    default:
      return "";
  }
}

function formatBackground(style) {
  switch (style) {
    case 0:
      return "Fade In";
    case 1:
      return "Mixing";
    case 2:
      return "Fade Out";
    default:
      return "";
  }
}

function formatRotate(x, z) {
  return { X: x, Z: z };
}

function formatPosition(x, y) {
  return { X: x, Y: y };
}
function formatMetaData(buffer, fileName) {
  const converted = JSON.parse(buffer);
  const metaData = {
    name: "《所謂「我不投資」，就是 all in 在法定貨幣》",
    description:'',
    fileName:fileName.replace('.json',''),
    ipfs_hash: converted.ipfs_hash.replace('https://ipfs.io/ipfs','ipfs:/'),
    attributes: {
      background: formatBackground(converted.bgIndex),
      publish_info_layout: formatLayout(converted.textStyle),
      coins_layout: formatCoinLayout(converted),
      coins_color: formatIdentity(fileName),
      coin_1_rotate: formatRotate(converted.randomA, converted.randomB),
      coin_2_rotate: formatRotate(converted.randomC, converted.randomD),
      coin_1_position: converted.isCentered
        ? undefined
        : formatPosition(converted.randomE, converted.randomF),
      coin_2_position: converted.isCentered
        ? undefined
        : formatPosition(converted.randomG, converted.randomH),
    },
  };
  return Buffer.from(JSON.stringify(metaData));
}

async function runConvert() {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file === "_metadata.json" || file === ".DS_Store") {
      continue;
    }
    const rawData = fs.readFileSync(`${readDir}/${file}`);

    writer.write(formatMetaData(rawData, file));

    if (i === files.length-1) {
      writer.write("]");
      writer.end();
    } else {
      writer.write(",\n");
    }
    console.log(`${file} metadata uploaded to ipfs & added to _metadata.json!`);
  }
}

runConvert();
