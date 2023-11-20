import { AxiosError, HttpStatusCode } from 'axios';
import { UserInfoEntity } from '../entities';
import { useUserStore } from 'src/stores/user-store';
import mitt from 'mitt';
import { ApiService } from './api.service';

export enum EVENT_USER_INFO_STORE_API {
  FETCHED = 'FETCHED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

type EventsUsersInfoStore = {
  [EVENT_USER_INFO_STORE_API.FETCHED]: UserInfoEntity;
  [EVENT_USER_INFO_STORE_API.UPDATED]: UserInfoEntity;
  [EVENT_USER_INFO_STORE_API.DELETED]: null;
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

    // throw new Error('User ID is not properly setted!');
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

    const apiServicePayload = ApiService.abortableRequest({
      method: 'get',
      url: URL,
    });

    const apiPromise = apiServicePayload.requestPromise
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (status === HttpStatusCode.Ok && data) {
          const entity = new UserInfoEntity(data);
          this.emitter.emit(EVENT_USER_INFO_STORE_API.FETCHED, entity);
          return { status: status, data: entity };
        }
        return { status: status, data: null };
      })
      .catch((error) => {
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;
          const data = error.response.data;
          switch (status) {
            case HttpStatusCode.Forbidden: {
              break;
            }
            case HttpStatusCode.NotFound: {
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

  async put(data: UserInfoEntity) {
    if (!this.userId || !this.id) throw new Error('Data must be fetched before update!'); // prettier-ignore
    const URL = `users/${this.userId}/info/${this.id}`;

    const apiServicePayload = ApiService.abortableRequest({
      method: 'put',
      url: URL,
      data: data,
    });

    const apiPromise = apiServicePayload.requestPromise
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (
          (status === HttpStatusCode.Ok || status === HttpStatusCode.Created) &&
          data
        ) {
          const entity = new UserInfoEntity(data);
          this.emitter.emit(EVENT_USER_INFO_STORE_API.UPDATED, entity);
          return { status: status, data: entity };
        }
        return { status: status, data: null };
      })
      .catch((error) => {
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;
          const data = error.response.data;
          switch (status) {
            case HttpStatusCode.Forbidden: {
              break;
            }
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

  async clear() {
    return this.put(UserInfoEntity.Empty);
  }
}
