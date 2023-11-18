import axios, { AxiosInstance } from 'axios';
import { EVENT_AUTH, eventBus } from '../event-bus';
import { IRefreshTokensResponsePayload } from 'src/utils/interfaces';
import { URL_BASE_HEROKU, URL_BASE_LOCAL, URL_REFRESH } from '@app/constants';

export class JwtTokensApi {
  constructor() {
    //
  }

  async fetchRefresh(refreshToken: string) {
    const baseURL = URL_BASE_LOCAL;
    // const baseURL = URL_BASE_HEROKU;
    const URL = baseURL + URL_REFRESH;

    const controller = new AbortController();
    const cancel = () => {
      controller.abort();
    };

    const axiosPromise = axios
      .post(URL, undefined, {
        signal: controller.signal,
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .then((response) => {
        const status = response.status;
        if (status === 401) {
          eventBus.emit(EVENT_AUTH.REFRESH_TOKEN_UNVALIDATED);
        }
        if (status === 201) {
          const data = response.data as IRefreshTokensResponsePayload;
          eventBus.emit(EVENT_AUTH.REFRESH_TOKEN_REFRESHED, data);
          return { status: status, data: data };
        }
        return { status: status, data: null };
      });

    return { axiosPromise: axiosPromise, cancel: cancel };
  }
}
