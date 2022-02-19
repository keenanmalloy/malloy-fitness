import { castIntEnv } from "./utils";

/**
 * * Application Settings
 */
export const APPLICATION = {
  get SERVER_URL() {
    return process.env.SERVER_URL || "";
  },
  get APP_URL() {
    return process.env.APP_URL || "";
  },
  get APP_NAME() {
    return process.env.APP_NAME;
  },
  get HOST() {
    return process.env.HOST || "";
  },
  get PORT() {
    return castIntEnv("PORT", 4000);
  },
  get MAX_REQUESTS() {
    return castIntEnv("MAX_REQUESTS", 1000);
  },
  get TIME_FRAME() {
    return castIntEnv("TIME_FRAME", 15 * 60 * 1000);
  },
};
