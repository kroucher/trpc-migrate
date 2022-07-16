#! /usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import discover from "./transforms/discover";

yargs(hideBin(process.argv))
  .command("discover", "Discover all existing tRPC routers", {}, discover)
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .parse();
