import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { URL_SIGNIN, URL_SIGNUP } from '@app/constants';
import { eventBus } from 'src/boot/event-bus';
import { UserInfoEntity } from '../entities';
import { useUserInfoStore } from 'src/stores/user-info-store';
import { useUserStore } from 'src/stores/user-store';
import mitt from 'mitt';

export enum EVENT_USER_INFO_STORE {
  FETCHED = 'FETCHED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

type EventsUsersInfoStore = {
  [EVENT_USER_INFO_STORE.FETCHED]: UserInfoEntity;
  [EVENT_USER_INFO_STORE.UPDATED]: UserInfoEntity;
  [EVENT_USER_INFO_STORE.DELETED]: null;
};

export class UserInfoApi {
  private userId = '';
  private id = null as string | null;
  readonly emitter = mitt<EventsUsersInfoStore>();
  // private _cancel = [] as (()=>void)[]; // prettier-ignore

  constructor(userId: string | null = null, id: string | null = null) {
    this.setup(userId, id);
  }

  private setupUserId(userId: string | null) {
    if (userId) {
      this.userId = userId;
      return;
    }

    const userStore = useUserStore();
    const id = userStore.$state.data?.id;
    if (id) {
      this.userId = id;
      return;
    }

    throw new Error('User ID is not properly setted!');
  }
  private setupId(id: string | null) {
    this.id = id;
  }
  setup(userId: string | null, id: string | null = null) {
    this.setupUserId(userId);
    this.setupId(id);
  }

  async fetch() {
    const URL = `users/${this.userId}/info`;

    const controller = new AbortController();
    const cancel = () => {
      controller.abort();
    };

    const axiosPromise = api
      .get(URL)
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (status === 200 && data) {
          const entity = new UserInfoEntity(data);
          this.emitter.emit(EVENT_USER_INFO_STORE.FETCHED, entity);
          return { status: status, data: entity };
        }
        return { status: status, data: null };
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const response = error.response;
          const status = response?.status;
          if (status === 403 || status === 404) {
            return { status: status, data: null };
          }
        }
        return null;
      });

    return { promise: axiosPromise, cancel: cancel };
  }

  async put(data: UserInfoEntity) {
    if (!this.userId || !this.id) throw new Error('Data must be fetched before update!'); // prettier-ignore
    const URL = `users/${this.userId}/info/${this.id}`;

    const controller = new AbortController();
    const cancel = () => {
      controller.abort();
    };
    const axiosPromise = api
      .put(URL, data.getUpdate(), { signal: controller.signal })
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if ((status === 200 || status === 201) && data) {
          const entity = new UserInfoEntity(data);
          this.emitter.emit(EVENT_USER_INFO_STORE.UPDATED, entity);
          return { status: status, data: entity };
        }
        return { status: status, data: null };
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const response = error.response;
          const status = response?.status;
          if (status === 403 || status === 409) {
            return { status: status, data: null };
          }
        }
      });

    return { promise: axiosPromise, cancel: cancel };
  }

  async clear() {
    return this.put(UserInfoEntity.Empty);
  }
}
