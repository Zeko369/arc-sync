// @ts-check

// TODOS:
// - expanded folders from SortableWindows
// - add space icons / colors
// - add mobx to be able to package this into a simple json
// - figure out prisma/trpc?/expo/probably t3 turbo
// - figure out how to package this (maybe deno?) and how to cron it?
// - figure out end2end encryption

import "https://deno.land/std@0.173.0/dotenv/load.ts";
import { Importer } from "./import/importer.ts";

const importer = new Importer();

const onCatch = (err: unknown) => err as Error;

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
      Authorization: `Bearer ${Deno.env.get("TOKEN")}`
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

Deno.addSignalListener("SIGINT", () => {
  console.log("Closing...");
  clearInterval(interval);
  Deno.exit();
});
