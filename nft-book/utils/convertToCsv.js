import { parse } from "json2csv";
import fs from "fs";
const basePath = process.cwd();

const readDir = `${basePath}/output/json`;
const rawData = fs.readFileSync(`${readDir}/_metadata.json`);
const converted = JSON.parse(rawData);

function shuffle(a, b) {
  const num = Math.random() > 0.5 ? -1 : 1;
  return num;
}

function formatIndex(index) {
  if (index < 10) {
    return `000${index}`;
  }
  if (index === 10 || index < 100) {
    return `00${index}`;
  }
  if (index === 100 || index < 1000) {
    return `0${index}`;
  }
  return index;
}

const data = converted.map((item) => {
  return {
    image: item.ipfs_hash,
    metadata: item,
  };
});

const sorted = data.sort(shuffle);
const populatedMeta = sorted.map((item, index) => {
  return {
    nftId: `moneyverse-${formatIndex(index)}`,
    uri: "https://api.ckxpress.com/book-nft/metadata?book_id=1",
    ...item,
    metadata: {
      ...item.metadata,
      description: `#${formatIndex(index)}`,
    },
  };
});

const csv = parse(populatedMeta);

fs.writeFileSync(`${basePath}/output/json/_metadata.csv`, csv);
