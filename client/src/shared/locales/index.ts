import translationsEN from "~locales/en/index";
import translationsMY from "~locales/my/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resources: { [language: string]: any } = {
  en: {
    name: "English, American",
    translation: translationsEN,
  },
  my: {
    name: "Malay",
    translation: translationsMY,
  },
};

export default resources;
