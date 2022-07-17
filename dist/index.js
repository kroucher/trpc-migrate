#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const discover_1 = __importDefault(require("./transforms/discover"));
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command("discover", "Discover all existing tRPC routers", {}, discover_1.default)
    .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
})
    .parse();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9iaW4vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esa0RBQTBCO0FBQzFCLDJDQUF3QztBQUN4QyxxRUFBNkM7QUFFN0MsSUFBQSxlQUFLLEVBQUMsSUFBQSxpQkFBTyxFQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN6QixPQUFPLENBQUMsVUFBVSxFQUFFLG9DQUFvQyxFQUFFLEVBQUUsRUFBRSxrQkFBUSxDQUFDO0tBQ3ZFLE1BQU0sQ0FBQyxTQUFTLEVBQUU7SUFDakIsS0FBSyxFQUFFLEdBQUc7SUFDVixJQUFJLEVBQUUsU0FBUztJQUNmLFdBQVcsRUFBRSwwQkFBMEI7Q0FDeEMsQ0FBQztLQUNELEtBQUssRUFBRSxDQUFDIn0=