import FormData from "form-data";
import fetch from "node-fetch";
import path from "path";
import fs from "fs";

const basePath = process.cwd();
const files = fs.readdirSync(`${basePath}/output/images`);

async function runUpload() {
  for (const file of files) {
    const formData = new FormData();
    const fileStream = fs.createReadStream(`${basePath}/files/images/${file}`);
    formData.append("file", fileStream);

    let url = "https://api.nftport.xyz/v0/files";
    let options = {
      method: "POST",
      headers: {
        Authorization: "process.env.XXXXX",
      },
      body: formData,
    };

    const data = await fetch(url, options)
      .then((res) => res.json())
      .catch((err) => console.error("error:" + err));

    if (data.file_name === ".DS_Store") continue;

    const fileName = path.parse(data.file_name).name;
    const rawdata = fs.readFileSync(`${basePath}/output/json/${fileName}.json`);
    let metaData = JSON.parse(rawdata);
    metaData.ipfs_hash = data.ipfs_url;

    //write into json
    fs.writeFileSync(
      `${basePath}/output/json/${fileName}.json`,
      JSON.stringify(metaData, null, 2)
    );

    console.log(
      `${data.file_name} uploaded to ipfs & ${fileName}.json updated!`
    );
  }
}

runUpload();
