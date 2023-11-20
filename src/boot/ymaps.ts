import { boot } from 'quasar/wrappers';
import {
  YANDEX_API_KEY,
  YANDEX_API_VERSION,
} from 'src/components/user-info/ymap/constants';

function generateScriptSrc(lang?: string) {
  // type lang = 'ru_RU' | 'ru_UA' | 'uk_UA' | 'tr_TR' | 'en_RU' | 'en_US' | 'he_IL' | 'en_IL'; // prettier-ignore
  const supportedLanguages = ['ru_RU', 'ru_UA', 'uk_UA', 'tr_TR', 'en_RU', 'en_US', 'he_IL', 'en_IL']; // prettier-ignore
  const defaultLanguage = 'en_RU';
  const selectedLanguage = supportedLanguages.find((value)=>value === lang) ?? defaultLanguage; // prettier-ignore

  let src = 'https://api-maps.yandex.ru/';
  src += YANDEX_API_VERSION;
  src += '/?apikey=';
  src += YANDEX_API_KEY;
  src += '&lang=';
  src += selectedLanguage;
  return src;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let resolveLoaded = ((_value: unknown) => {/**/}) as (value: unknown) => void; //prettier-ignore

function generateScript(lang?: string) {
  const script = document.createElement('script');

  script.src = generateScriptSrc(lang);
  script.type = 'text/javascript';
  script.async = true;
  return script;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default boot(({ app }) => {
  const script = generateScript();
  script.onload = resolveLoaded;
  const htmlRootElement = document.documentElement;
  const childs = htmlRootElement.childNodes;
  const child = childs.item(childs.length - 1);
  child.appendChild(script);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const scriptLoaded = new Promise((resolve, reject) => {
  resolveLoaded = resolve;
});
