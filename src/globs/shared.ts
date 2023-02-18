import { platform } from "os";
import { env } from "process";
// import { highlight as highlightRaw } from "cli-highlight";
import { getPackageJson } from "../packageJson";

/**
 * Whether or not users must have a valid subscription to access the API.
 */
export const SUBSCRIPTION_LOCK = true;

/**
 * The contents of the package.json file at runtime.
 */
export const PACKAGE_JSON = await getPackageJson();
if (!PACKAGE_JSON) {
  throw new Error("Failed to get package.json. Please report this: https://twitter.com/gptlabs");
}

/**
 * The version of this package at runtime.
 */
export const { version: VERSION } = PACKAGE_JSON;

/**
 * Whether this is the canary build.
 */
export const CANARY = VERSION.includes("canary");

/**
 * Whether this process is running in development mode.
 */
export const DEVELOPMENT = (
  /** Inlined by compiler. */
  process.env.NODE_ENV === "development" ||
  /** Checked at runtime. */
  env.NODE_ENV === "test"
);

export const TESTING = env.NODE_ENV === "test";
export const PRODUCTION = !DEVELOPMENT;

/**
 * The URL this site is running on.
 */
export const DOMAIN =
  PRODUCTION
    ? (
      CANARY
        ? "canary.gptlabs.us"
        : "api.gptlabs.us"
    )
    : "localhost:3000";

export const DOMAIN_URL =
  DOMAIN === "localhost:3000"
    ? `http://${DOMAIN}`
    : `https://${DOMAIN}`;



export const PLATFORM = platform();

export const TRANSCRIPT_LIMIT = 3500;

export const DEFAULT_ENTRAPMENT = `In this prompt, the user is presented with a simulated SSH session with an established connection to a server with protected assets. The prompt includes a typical shell prompt, indicating the current user, hostname, and current working directory. The files in the current directory are randomized to be plausible, but not actual protected assets. By presenting a realistic-looking but fictional directory of files, the prompt can help to create a more believable simulation of an SSH session while still protecting the actual assets on the server. The user can then type their command as they would in a normal SSH session, without any additional instructions or explanations. Here is the current session history:In this prompt, the user is presented with a simulated SSH session with an established connection to a server with protected assets. The prompt includes a typical shell prompt, indicating the current user, hostname, and current working directory. The files in the current directory are randomized to be plausible, but not actual protected assets. By presenting a realistic-looking but fictional directory of files, the prompt can help to create a more believable simulation of an SSH session while still protecting the actual assets on the server. The user can then type their command as they would in a normal SSH session, without any additional instructions or explanations. Here is the current session history:`;