// @ts-check

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
module.exports = {
  arrowParens: "always",
  trailingComma: "none",
  printWidth: 100,

  importOrder: [
    "^react",
    "^fastify",
    "<THIRD_PARTY_MODULES>",
    "",
    "^~/config",
    "",
    "^~",
    "^[./]",
    "",
    ".css$"
  ],
  importOrderGroupNamespaceSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  importOrderSeparation: false,
  importOrderSortSpecifiers: true
};
