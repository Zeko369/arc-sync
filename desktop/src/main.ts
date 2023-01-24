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

const onCatch = (err: any) => err as Error;

const parseAndSend = async () => {
  const data = await importer.import().catch(onCatch);
  if (data instanceof Error) {
    if (data.message === "SAME_FILE") {
      console.log("No changes");
      return;
    }

    console.log("Error parsing", data);
    return;
  }

  const res = await fetch(`https://arc-sync-production.up.railway.app/sync`, {
    method: "POST",
    body: JSON.stringify({ data: data.toJSON() }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env["TOKEN"]}`
    }
  }).catch(onCatch);

  if (res instanceof Error) {
    console.log("Error sending data");
    console.log(res);
    return;
  }

  if (!res.ok) {
    console.log("Error sending data");
    console.log(await res.json());
    return;
  }

  console.log("Sent data");
};

const interval = setInterval(() => parseAndSend(), 1000);

process.on("beforeExit", () => {
  console.log("Closing...");
  clearInterval(interval);
});
