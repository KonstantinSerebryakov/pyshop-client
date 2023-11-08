import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { route } from 'quasar/wrappers';
import { EVENT_AUTH, eventBus } from 'src/boot/event-bus';
import router from 'src/router';
import routes from 'src/router/routes';
import { UserEntity, UserInfoEntity } from 'src/utils/entities';
import { ILoginResponsePayload, IUser, IUserInfo } from 'src/utils/interfaces';

export const useUserInfoStore = defineStore('user_info', {
  state: () => ({
    data: useLocalStorage('user_info', null as UserInfoEntity | null, {
      serializer: {
        read: (v: string) => {
          const parsed = v ? JSON.parse(v) : null;
          return parsed ? new UserInfoEntity(parsed as IUserInfo) : null;
        },
        write: (v: UserInfoEntity) => {
          return JSON.stringify(v as IUserInfo);
        },
      },
    }),
  }),
  getters: {},
  actions: {
    clear() {
      this.$state.data = null;
    },
  },
});
