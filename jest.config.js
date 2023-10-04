const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  maxWorkers: 4,
  projects: [
    {
      preset: "ts-jest",
      testEnvironment: "node",
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/",
      }),
      setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
      collectCoverageFrom: [
        "<rootDir>/src/server/api/**/*.helper.ts",
        "<rootDir>/src/utils/**/*.ts",
      ],
      testMatch: ["**/*.spec.ts"],
    },
  ],
};
