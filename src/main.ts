// @ts-check

// TODOS:
// - expanded folders from SortableWindows
// - add space icons / colors
// - add mobx to be able to package this into a simple json
// - figure out prisma/trpc?/expo/probably t3 turbo
// - figure out how to package this (maybe deno?) and how to cron it?
// - figure out end2end encryption

import { join } from "node:path";
import { config } from "dotenv";

import { Importer } from "./import/importer";

config({ path: join(__dirname, "../.env") });

const importer = new Importer();

const int = setInterval(async () => {
  try {
    const data = await importer.import();

    try {
      const res = await fetch(`http://192.168.0.129:3000/syncs/${process.env["USER_ID"]}`, {
        method: "POST",
        body: JSON.stringify({ data: data.toJSON() }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.log("Error sending data");
        console.log(await res.json());
        return;
      }

      console.log("Sent data");
    } catch (err) {
      console.log("Error sending data");
      console.log(err);
    }
  } catch (e) {
    console.error("Error parsing", e);
  }
}, 2000);

process.on("beforeExit", () => {
  clearInterval(int);
  console.log("Closing...");
});
