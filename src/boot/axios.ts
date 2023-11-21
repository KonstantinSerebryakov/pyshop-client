import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useUserStore } from 'src/stores/user-store';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
function extractBaseUrl() {
  const env = process.env.NODE_ENV;
  if (env === 'development') {
    return 'http://127.0.0.1:3333/api';
  }
  if (env === 'production') {
    return 'https://pyshop-konstantin-serebryakov-8ebd937f65cc.herokuapp.com/api';
  }
}

const api = axios.create({ baseURL: extractBaseUrl() }); // prettier-ignore
// api.defaults.baseURL
// const api = axios.create({baseURL:'https://pyshop-konstantin-serebryakov-8ebd937f65cc.herokuapp.com/api'}); // prettier-ignore

export default boot(({ app, store }) => {
  extractBaseUrl();
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
