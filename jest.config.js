const { config } = require("dotenv");
config({ path: "./env/test.env" });
module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testEnvironment: "node",
  testRegex: ["./test/.*.spec.ts$", "./src/.*\\.(test|spec)?\\.(ts|ts)$"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globalSetup: "./test/common/global-setup.js",
  globalTeardown: "./test/common/global-teardown.ts",
};
