const urlEnvironmentPrefix =
  import.meta.env.VITE_NODE_ENV === "production"
    ? ""
    : `${import.meta.env.VITE_URL_ENVIRONMENT_PREFIX}.`;

export const MYINFO_CONFIG = {
  MYINFO_CLIENT_ID: import.meta.env.VITE_MYINFO_CLIENT_ID,
  MYINFO_CALLBACK_URL: import.meta.env.VITE_MYINFO_REDIRECT_URL,
  MYINFO_PURPOSE_ID: import.meta.env.VITE_MYINFO_PURPOSE_ID,
  MYINFO_SCOPES: import.meta.env.VITE_MYINFO_SCOPE,
  MYINFO_METHOD: import.meta.env.VITE_MYINFO_METHOD,
  MYINFO_AUTH_API_URL: `https://${urlEnvironmentPrefix}api.myinfo.gov.sg/com/v4/authorize`,
};
