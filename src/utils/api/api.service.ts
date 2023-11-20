import { AxiosError, AxiosRequestConfig, HttpStatusCode, Method } from 'axios';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';

export class ApiService {
  static abortableRequest(
    config: AxiosRequestConfig<any> & {
      method: Method;
      url: string;
    }
  ) {
    const controller = new AbortController();

    const abort = () => {
      controller.abort();
    };

    const apiPromise = api
      .request({
        ...config,
        signal: controller.signal,
        timeout: 30_000, // 1000ms = 1s
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          switch (error.status) {
            case HttpStatusCode.RequestTimeout: {
              Notify.create({
                type: 'error',
                message: 'RequestTimeout has been occured.\n' + config.url,
                position: 'top',
              });
              // return;
              break;
            }
            case HttpStatusCode.InternalServerError: {
              Notify.create({
                type: 'error',
                message: 'InternalServerError has been occured.\n' + config.url,
                position: 'top',
              });
              // return;
              break;
            }
          }
        }
        return Promise.reject(error);
      });

    return { abort: abort, requestPromise: apiPromise };
  }
}
