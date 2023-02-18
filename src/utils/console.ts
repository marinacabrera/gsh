import { style } from "@tsmodule/log";
import { readFile } from "fs/promises";
import { VERSION } from "../globs/shared";

export const displayLogoAndVersion = async () => {
    const logoPath = new URL("./header.txt", import.meta.url);
    const logoFile = await readFile(logoPath, "utf8");
    const logoText = logoFile.replace("(A version number goes here)", VERSION);

    console.log(style(logoText, ["dim"]));
}

export const displayWarning = (message: string) => {
    console.log(style(message, ["bold", "yellow"]));
}

export const displayDimmed = (message: string) => {
    console.log(style(message, ["dim"]));
}

export const displayPrompt = (message: string) => {
    console.log(style(message, ["bold"]));
}

export const trimLinePrefixes = (shellText: string) => shellText.trim().split("\n").map(
    (line: string) => line.replace(/^\$ /, "")
  ).join("\n");

export const promptStyle = ` ${style("$", ["bold", "dim"])} `;

export const entrappedStyle = ` ${style("$", ["bold"])} `;