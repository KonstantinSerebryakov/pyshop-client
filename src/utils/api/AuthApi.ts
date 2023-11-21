import { AxiosError, HttpStatusCode } from 'axios';
import { URL_PARAM_IS_PUBLIC, URL_SIGNIN, URL_SIGNUP } from '@app/constants';
import { EVENT_AUTH, eventBus } from 'src/boot/event-bus';
import { useUserStore } from 'src/stores/user-store';
import { ApiService } from './ApiService';

export class AuthApi {
  static async register(payload: { email: string; password: string }) {
    const URL = URL_SIGNUP;

    const apiServicePayload = ApiService.abortableRequest({
      method: 'post',
      url: URL,
      params: { [URL_PARAM_IS_PUBLIC]: true },
      data: payload,
    });

    const apiPromise = apiServicePayload.requestPromise
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (status === HttpStatusCode.Created && data) {
          // const user = new UserEntity();
          return { status: status, data: data };
        }
        return { status: status, data: data };
      })
      .catch((error) => {
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;
          const data = error.response.data;
          switch (status) {
            case HttpStatusCode.Conflict: {
              break;
            }
          }
          return { status: status, data: data ?? null };
        }
        return null;
      });

    return {
      abort: apiServicePayload.abort,
      apiPromise: apiPromise,
    };
  }

  private static extractDeviceId() {
    const userStore = useUserStore();
    return userStore.$state.deviceId;
  }

  static async login(payload: { email: string; password: string }) {
    const URL = URL_SIGNIN;

    const apiServicePayload = ApiService.abortableRequest({
      method: 'post',
      url: URL,
      params: { [URL_PARAM_IS_PUBLIC]: true },
      data: { ...payload, deviceId: this.extractDeviceId() },
    });

    const apiPromise = apiServicePayload.requestPromise
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (status === HttpStatusCode.Created && data) {
          // const user = new UserEntity();
          eventBus.emit(EVENT_AUTH.LOGIN_SUCCESS, data);
          return { status: status, data: data };
        }
        return { status: status, data: null };
      })
      .catch((error) => {
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;
          const data = error.response.data;
          switch (status) {
            case HttpStatusCode.NotFound: {
              break;
            }
            case HttpStatusCode.Unauthorized: {
              break;
            }
          }
          return { status: status, data: data ?? null };
        }
        return Promise.resolve(null);
      });

    return {
      abort: apiServicePayload.abort,
      apiPromise: apiPromise,
    };
  }

  static logout(refreshToken?: string) {
    if (!refreshToken) return;
    const URL = URL_SIGNIN;

    const apiServicePayload = ApiService.abortableRequest({
      method: 'post',
      url: URL,
      params: { [URL_PARAM_IS_PUBLIC]: true },
      data: { token: refreshToken },
    });

    const apiPromise = apiServicePayload.requestPromise.catch((error) => {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const data = error.response.data;
        return { status: status, data: data ?? null };
      }
      return Promise.resolve(null);
    });

    return {
      abort: apiServicePayload.abort,
      apiPromise: apiPromise,
    };
  }
}
