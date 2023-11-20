import { boot } from 'quasar/wrappers';
import { JwtTokensService } from './util/tokens.service';
import { URL_PARAM_IS_PUBLIC, URL_REFRESH } from '@app/constants';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

export default boot(({ app, store }) => {
  const api = app.config.globalProperties.$api;
  const tokensService = new JwtTokensService();

  //
  // REQUEST
  //
  async function handleDevInterceptor(
    config: InternalAxiosRequestConfig<unknown>
  ): Promise<InternalAxiosRequestConfig<unknown>> {
    const path = config.url;
    if (!config.baseURL || !path) {
      throw new AxiosError(`axios:${(config.baseURL, path)}`);
    }
    if (path === URL_REFRESH) {
      throw new AxiosError(
        URL_REFRESH + ' endpoint should not be fetched with this instance!'
      );
    }
    return config;
  }
  async function handleTokenInterceptor(
    config: InternalAxiosRequestConfig<unknown>
  ): Promise<InternalAxiosRequestConfig<unknown>> {
    const params = config.params;
    const isPublic = (params && params[URL_PARAM_IS_PUBLIC]) ?? false;
    if (isPublic) return config;

    const token = await tokensService.getAccessTokenAndRefresh();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    const controller = new AbortController();
    config.signal = controller.signal;
    controller.abort();
    return config;
    // throw new AxiosError('Access token is not found', '401', undefined, config, {});
  }
  async function handleRequestCleanupInterceptor(
    config: InternalAxiosRequestConfig<unknown>
  ): Promise<InternalAxiosRequestConfig<unknown>> {
    if (!config.params) return config;
    const entries = Object.entries(config.params);
    const filtered = entries.filter((pair) => pair[0] !== URL_PARAM_IS_PUBLIC);
    config.params = Object.fromEntries(filtered);
    return config;
  }
  const requestInterceptorId =
    app.config.globalProperties.$api.interceptors.request.use(
      async (config) => {
        let tmpConfig: typeof config;
        tmpConfig = await handleDevInterceptor(config);
        tmpConfig = await handleTokenInterceptor(config);
        tmpConfig = await handleRequestCleanupInterceptor(config);
        return tmpConfig;
      },
      (error) => {
        console.error(error.toString());
        return Promise.reject(error);
      }
    );

  //
  // RESPONSE
  //
  const handleUnauthorizedResponseInterceptorId =
    app.config.globalProperties.$api.interceptors.response.use(
      (response) => {
        console.log(response);
        return response;
      },
      (error) => {
        console.log(error);
        if (error instanceof AxiosError) {
          const response = error.response;
          const status = response?.status;
          if (status && status === 401) {
            tokensService.refreshTokens();
            // return null;
          }
        }
        return Promise.reject(error);
      }
    );
});
