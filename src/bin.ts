#!/usr/bin/env node
/* eslint-disable no-console */
import { clear } from "@tsmodule/log";
import { createInterface } from "readline";
import { stdin, stdout } from "process";
import { appendToTranscript, getEntrapment, getTranscript } from "./utils/filesystem";
import { fetchResponseFromApi } from "./utils/api";
import { checkAuth } from "./utils/api";
import {
  displayDimmed,
  displayLogoAndVersion,
  displayPrompt,
  displayWarning,
  entrappedStyle,
  promptStyle,
  trimLinePrefixes,
} from "./utils/console";

checkAuth();

const rl = createInterface({
  input: stdin,
  output: stdout,
});

rl.on("SIGINT", () => {
  process.exit(1);
});

clear({ flush: true });

await displayLogoAndVersion();

const entrapped = process.argv.slice(2).includes('--entrap');
if (entrapped) {
  displayWarning("Experimental feature. This will try to simulate a remote SSH session.");
  displayWarning("It can have unintended consequences. Use at your own risk.")
}

while (true) {
  const transcript = entrapped ? await getEntrapment() : await getTranscript();
  const prompt = entrapped ? entrappedStyle : promptStyle;
  const command = await new Promise<string>((resolve) => {
    rl.question(prompt, resolve);
  });

  const response = await fetchResponseFromApi(command, transcript)
  const { native } = response;
  if (native) {
    const replacedLinePrefixes = trimLinePrefixes(native);
    if (entrapped) {
      displayPrompt(replacedLinePrefixes);
    } else {
      displayDimmed(replacedLinePrefixes);
    }
    await appendToTranscript(command, native);
  }
}