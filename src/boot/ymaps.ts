import { boot } from 'quasar/wrappers';
import { API_KEY, API_VERSION } from 'src/composables/ymap/constants';

function generateScriptSrc(lang?: string) {
  // type lang = 'ru_RU' | 'ru_UA' | 'uk_UA' | 'tr_TR' | 'en_RU' | 'en_US' | 'he_IL' | 'en_IL'; // prettier-ignore
  const supportedLanguages = ['ru_RU', 'ru_UA', 'uk_UA', 'tr_TR', 'en_RU', 'en_US', 'he_IL', 'en_IL']; // prettier-ignore
  const defaultLanguage = 'en_RU';
  const selectedLanguage = supportedLanguages.find((value)=>value === lang) ?? defaultLanguage; // prettier-ignore

  let src = 'https://api-maps.yandex.ru/';
  src += API_VERSION;
  src += '/?apikey=';
  src += API_KEY;
  src += '&lang=';
  src += selectedLanguage;
  return src;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
let resolveLoaded = ((value: unknown) => {}) as (value: unknown) => void;

function generateScript(lang?: string) {
  const script = document.createElement('script');

  script.src = generateScriptSrc(lang);
  script.type = 'text/javascript';
  script.async = true;
  return script;
}

export default boot(({ app }) => {
  const script = generateScript();
  script.onload = resolveLoaded;
  const htmlRootElement = document.documentElement;
  const childs = htmlRootElement.childNodes;
  const child = childs.item(childs.length - 1);
  child.appendChild(script);
});

export const scriptLoaded = new Promise((resolve, reject) => {
  resolveLoaded = resolve;
});
