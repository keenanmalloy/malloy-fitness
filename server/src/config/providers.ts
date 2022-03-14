/**
 * * Provider Settings
 */
export const PROVIDERS = {
  get REDIRECT_SUCCESS() {
    return process.env.PROVIDER_SUCCESS_REDIRECT;
  },
  get REDIRECT_FAILURE() {
    return process.env.PROVIDER_FAILURE_REDIRECT;
  },
  get GOOGLE() {
    return {
      get clientID() {
        return process.env.GOOGLE_CLIENT_ID || "";
      },
      get clientSecret() {
        return process.env.GOOGLE_CLIENT_SECRET || "";
      },
      get scope() {
        return ["email", "profile"];
      },
    };
  },
};
