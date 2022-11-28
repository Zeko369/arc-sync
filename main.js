// @ts-check

// TODOS:
// - expanded folders from SortableWindows
// - add space icons / colors
// - add mobx to be able to package this into a simple json
// - figure out prisma/trpc?/expo/probably t3 turbo
// - figure out how to package this (maybe deno?) and how to cron it?
// - figure out end2end encryption

const path = require("node:path");
const fs = require("node:fs");

const filepath = `${process.env.HOME}/Library/Application\ Support/Arc/StorableSidebar.json`;
const file = fs.readFileSync(path.resolve(__dirname, filepath), "utf8");

const parsed = JSON.parse(file);
fs.writeFileSync("./tmp.json", JSON.stringify(parsed, null, 2));

const windows = parsed["sidebar"]["containers"].filter((window) => !window["global"]);
const window = windows[0];

const iterateOverWeirdArray = (array, callback) => {
  if (!array) {
    throw new Error("Array is undefined");
  }

  if (!Array.isArray(array)) {
    throw new Error("Array is not an array");
  }

  if (array.length % 2 === 1) {
    throw new Error("Array length must be even");
  }

  for (let i = 0; i < array.length; i += 2) {
    callback(array[i], array[i + 1]);
  }
};

const convertArrayToThanosArray = (array) => {
  const result = [];
  iterateOverWeirdArray(array, (key, value) => result.push(value));
  return result;
};

const convertArrayToObj = (array) => {
  const obj = {};
  iterateOverWeirdArray(array, (key, value) => (obj[key] = value));
  return obj;
};

const spacesObj = {};
const topLevelContainerIDs = [];
iterateOverWeirdArray(window["spaces"], (spaceId, spaceObj) => {
  const containerIds = convertArrayToObj(spaceObj["containerIDs"]);
  topLevelContainerIDs.push(
    { type: "pinned", id: containerIds["pinned"], spaceId, spaceTitle: spaceObj["title"] },
    { type: "unpinned", id: containerIds["unpinned"], spaceId, spaceTitle: spaceObj["title"] }
  );

  spacesObj[spaceId] = {
    id: spaceId,
    title: spaceObj["title"],
    containers: {
      pinned: { containerId: containerIds["pinned"], tabs: [] },
      unpinned: { containerId: containerIds["unpinned"], tabs: [] },
    },
  };
});

const getContainer = (id) => topLevelContainerIDs.find((obj) => obj.id === id);

const itemsObj = convertArrayToObj(window["items"]);
const array = convertArrayToThanosArray(window["items"]);

const getType = (obj) => {
  return Object.keys(obj["data"])[0];
};

// class Node {
//   /** @type {string} */
//   id;

//   /** @type {string[]} */
//   #childrenIds = [];

//   /** @type {string | null} */
//   title = null;

//   /** @type {string | null} */
//   parentID = null;

//   /** @param {{id: string, childrenIds: string[], title: string | null, parentID: string | null}} data */
//   constructor(data) {
//     this.id = data.id;
//     this.title = data.title;

//     this.parentID = data.parentID;
//     this.#childrenIds = data.childrenIds;
//   }

//   get children() {
//     return this.#childrenIds.map((id) => itemsObj[id]);
//   }
// }

// class TabNode extends Node {
//   /** @type {string} */
//   url;

//   /** @type {null | {type: 'emoji', value: string} | {type: 'icon', value: string}} */
//   favicon = null;
// }

// class FolderNode extends Node {
//   /** @type {(TabNode | FolderNode)[]} */
//   items = [];

//   constructor(data) {
//     super(data);
//   }
// }

const handleItem = (item, tabs) => {
  console.log(item);

  switch (getType(item)) {
    case "itemContainer":
      return {
        id: item["id"],
        type: "container",
        title: item["title"],
        tabs: item["childrenIds"].map((childId) => handleItem(itemsObj[childId])),
      };
    case "list":
      return {
        id: item["id"],
        type: "folder",
        title: item["title"],
        tabs: item["childrenIds"].map((childId) => handleItem(itemsObj[childId])),
      };
    case "tab":
      if (item["data"]["tab"]["customInfo"]) {
        console.log(item["data"]["tab"]["customInfo"]);
      }

      return {
        id: item["id"],
        type: "tab",
        title: item["title"] || item["data"]["tab"]["savedTitle"],
        url: item["data"]["tab"]["savedURL"],
        customIcon: item["data"]["tab"]["customInfo"]?.["iconType"],
      };
  }
};

const MAIN_ID = "1D5B301B-F095-4737-80DA-924DC992978D";
array.forEach((item) => {
  // find top level itemContainero

  if (!item["data"]["itemContainer"]) {
    return;
  }

  const containerObj = item["data"]["itemContainer"]["containerType"]["spaceItems"];
  if (!containerObj) {
    return;
  }

  const container = getContainer(item["id"]);
  // if (container["spaceId"] !== MAIN_ID) {
  //   return; // debug
  // }

  spacesObj[container["spaceId"]].containers[container["type"]].tabs = handleItem(item, []);
});

fs.writeFileSync("./result.json", JSON.stringify(spacesObj, null, 2));

// console.log(spacesObj[MAIN_ID]["tabs"]["pinned"]["tabs"].at(-1));
