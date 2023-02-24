#!/usr/bin/env node
/* eslint-disable no-console */
import { createInterface } from "readline";
import { stdin, stdout } from "process";
import { appendToTranscript, getTranscript } from "./utils/filesystem";
import { fetchResponseFromApi, checkAuth } from "./utils/api";
import {
  displayDimmed,
  displayLogoAndVersion,
  displayWarning,
  executeCommand,
  promptStyle,
  trimLinePrefixes,
} from "./utils/console";

checkAuth();

const rl = createInterface({
  input: stdin,
  output: stdout
});

rl.on("SIGINT", () => {
  process.exit(1);
});

const isDryMode = process.argv.slice(2).includes('--dry-mode');
await displayLogoAndVersion();
if (isDryMode) {
  displayWarning("You're running in dry-mode, no command will be executed.");
}


while (true) {
  const transcript = await getTranscript();
  const command = await new Promise<string>((resolve) => {
    rl.question(promptStyle, resolve);
  });

  try {
    const { native } = await fetchResponseFromApi(command, transcript)
    const replacedLinePrefixes = trimLinePrefixes(native)
    console.log();
    if (!isDryMode) {
      console.log();
      await executeCommand(replacedLinePrefixes);
      console.log();
    } else {
      displayDimmed(replacedLinePrefixes);
      console.log();
    }
    await appendToTranscript(command, native);
  } catch (e: any) {
    console.log();
    displayWarning(`Error: ${e.message}`);
  }
}
