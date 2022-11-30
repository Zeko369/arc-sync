// @ts-check

// TODOS:
// - expanded folders from SortableWindows
// - add space icons / colors
// - add mobx to be able to package this into a simple json
// - figure out prisma/trpc?/expo/probably t3 turbo
// - figure out how to package this (maybe deno?) and how to cron it?
// - figure out end2end encryption

import { Importer } from "./import/importer";

new Importer()
  .import()
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
