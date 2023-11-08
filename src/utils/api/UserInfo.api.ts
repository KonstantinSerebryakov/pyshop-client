import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { URL_SIGNIN, URL_SIGNUP } from '@app/constants';
import { EVENT_AUTH, eventBus } from 'src/boot/event-bus';

export class UserInfoApi {
  // static async reset(payload: { email: string; password: string }) {
  // static async update(payload: { email: string; password: string }) {
  // static async reset(payload: { email: string; password: string }) {
  static async reset(payload: { email: string; password: string }) {
    const URL = URL_SIGNUP;

    const controller = new AbortController();
    const cancel = () => {
      controller.abort();
    };

    const axiosPromise = api
      .post(URL, payload, { signal: controller.signal })
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (status === 201 && data) {
          // const user = new UserEntity();
          return { status: status, data: data };
        }
      })
      .catch((error) => {
        const response = error.response;
        const status = response.status;
        if (status === 409) {
          return { status: status, data: null };
        }
        console.error(response.status + ': ' + response.data);
      });
    return { promise: axiosPromise, cancel: cancel };
  }

  static async login(payload: { email: string; password: string }) {
    const URL = URL_SIGNIN;

    const controller = new AbortController();
    const cancel = () => {
      controller.abort();
    };

    const axiosPromise = api
      .post(URL, payload, { signal: controller.signal })
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (status === 201 && data) {
          // const user = new UserEntity();
          eventBus.emit(EVENT_AUTH.LOGIN_SUCCESS, data);
          return { status: status, data: data };
        }
      })
      .catch((error) => {
        const response = error.response;
        const status = response.status;
        if (status === 404 || status === 401) {
          return { status: status, data: null };
        }
        console.error(response.status + ': ' + response.data);
      });
    return { promise: axiosPromise, cancel: cancel };
  }
}
