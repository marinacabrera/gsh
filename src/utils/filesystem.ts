import { existsSync, mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { dirname } from "path";
import { CONFIG_FILES } from "../globs/node";
import { DEFAULT_ENTRAPMENT, TRANSCRIPT_LIMIT } from "../globs/shared";
import { decode, encode } from "gpt-3-encoder";

const getFile = async (path: string) => {
  const dir = dirname(path);
  if (existsSync(path)) {
    return await readFile(path, "utf8");
  }

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  await writeFile(path, "", "utf8");
  return "";
};

const enforceTranscriptTokenLimit = async (transcript: string) => {
  const gptEncoded = encode(transcript);
  if (gptEncoded.length < TRANSCRIPT_LIMIT) return transcript;
  const enforcedEncodedTranscript = gptEncoded.reverse().slice(0, TRANSCRIPT_LIMIT);
  return decode(enforcedEncodedTranscript.reverse());
}

export const getConfig = async (type: keyof typeof CONFIG_FILES) => {
  const file = await getFile(CONFIG_FILES[type]);
  return JSON.parse(file || "{}");
};

export const getEntrapment = async () => {
  const entrapment = await getFile(CONFIG_FILES.ENTRAPMENT);
  const transcript = await getTranscript();
  if (entrapment) return `${entrapment} \n${transcript}`
  return `${DEFAULT_ENTRAPMENT} \n${transcript}`
};

export const getTranscript = async () => {
  const file = await getFile(CONFIG_FILES.TRANSCRIPT);
  return enforceTranscriptTokenLimit(file) || "";
};

export const appendToTranscript = async (
  command: string,
  native: string,
) => {
  const transcriptItem =
`

${command}

${native}`;

  await writeFile(
    CONFIG_FILES.TRANSCRIPT,
    transcriptItem,
    { flag: "a" }
  );
};
