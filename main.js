const path = require("node:path");
const fs = require("node:fs");

const filepath = `${process.env.HOME}/Library/Application\ Support/Arc/StorableSidebar.json`;
const file = fs.readFileSync(path.resolve(__dirname, filepath), "utf8");

const parsed = JSON.parse(file);

fs.writeFileSync("./tmp.json", JSON.stringify(parsed, null, 2));
