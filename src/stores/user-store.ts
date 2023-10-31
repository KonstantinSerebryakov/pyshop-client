import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { route } from 'quasar/wrappers';
import { EVENT_AUTH, eventBus } from 'src/boot/event-bus';
import router from 'src/router';
import routes from 'src/router/routes';
import { UserEntity } from 'src/utils/entities';
import { ILoginResponsePayload, IUser } from 'src/utils/interfaces';

export const useUserStore = defineStore('counter', {
  state: () => ({
    data: useLocalStorage('user', null as UserEntity | null, {
      serializer: {
        read: (v: string) => {
          const parsed = v ? JSON.parse(v) : null;
          return parsed ? new UserEntity(parsed as IUser) : null;
        },
        write: (v: UserEntity) => {
          return JSON.stringify(v as IUser);
        },
      },
    }),
    token: useLocalStorage('access_token_jwt', null as string | null, {}),
  }),
  getters: {},
  actions: {
    clear() {
      this.$state.data = null;
      this.$state.token = null;
    },
  },
});
