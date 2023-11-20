import { useLocalStorage } from '@vueuse/core';
// import { DeviceUUID } from 'device-uuid';
import { defineStore } from 'pinia';
import { UserEntity } from 'src/utils/entities';
import { IToken, IUser } from 'src/utils/interfaces';
import { v4 as getUuidv4 } from 'uuid';

export const useUserStore = defineStore('user', {
  state: () => ({
    data: useLocalStorage('user', null as UserEntity | null, {
      serializer: {
        read: (v: string) => {
          const parsed = v ? JSON.parse(v) : null;
          return parsed ? new UserEntity(parsed as IUser) : null;
        },
        write: (v: UserEntity | null) => {
          return v ? JSON.stringify(v as IUser) : '';
        },
      },
    }),
    accessToken: useLocalStorage('access_token_jwt', null as IToken | null, {
      serializer: {
        read: (v: string) => {
          const parsed = v ? JSON.parse(v) : null;
          return parsed ? (parsed as IToken | null) : null;
        },
        write: (v: IToken | null) => {
          return v ? JSON.stringify(v) : '';
        },
      },
    }),
    refreshToken: useLocalStorage('refresh_token_jwt', null as IToken | null, {
      serializer: {
        read: (v: string) => {
          const parsed = v ? JSON.parse(v) : null;
          return parsed ? (parsed as IToken | null) : null;
        },
        write: (v: IToken | null) => {
          return v ? JSON.stringify(v) : '';
        },
      },
    }),
    deviceId: useLocalStorage('deviceId', getUuidv4().toString() as string, {}),
    // deviceId: useLocalStorage(
    //   'deviceId',
    //   new DeviceUUID().toString() as string,
    //   {}
    // ),
  }),
  getters: {},
  actions: {
    clear() {
      this.$state.data = null;
      this.clearRefreshToken();
      this.clearAccessToken();
    },
    clearRefreshToken() {
      this.$state.refreshToken = null;
    },
    clearAccessToken() {
      this.$state.accessToken = null;
    },
  },
});
