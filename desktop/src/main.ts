// @ts-check

// TODOS:
// - expanded folders from SortableWindows
// - add space icons / colors
// - add mobx to be able to package this into a simple json
// - figure out prisma/trpc?/expo/probably t3 turbo
// - figure out how to package this (maybe deno?) and how to cron it?
// - figure out end2end encryption

import { join } from "node:path";
import { watch } from "node:fs/promises";
import { config } from "dotenv";

import { Importer } from "./import/importer";

config({ path: join(__dirname, "../.env") });

const importer = new Importer();
const ac = new AbortController();

process.on("beforeExit", () => {
  console.log("Closing...");
  ac.abort();
});

const onCatch = (err: any) => err as Error;

const parseAndSend = async () => {
  const data = await importer.import().catch(onCatch);
  if (data instanceof Error) {
    console.log("Error parsing", data);
    return;
  }

  const res = await fetch(`https://arc-sync-production.up.railway.app/sync`, {
    method: "POST",
    body: JSON.stringify({ data: data.toJSON() }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env["TOKEN"]}`,
    },
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

(async () => {
  await parseAndSend();

  try {
    const watcher = watch(Importer.FILENAME, { signal: ac.signal });
    for await (const event of watcher) {
      parseAndSend();
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") return;
    }

    throw error;
  }
})();
