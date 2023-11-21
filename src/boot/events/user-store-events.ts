import { boot } from 'quasar/wrappers';
import { useUserStore } from 'src/stores/user-store';
import { EVENT_AUTH } from '../event-bus';
import {
  ILoginResponsePayload,
  IRefreshTokensResponsePayload,
} from 'src/utils/interfaces';
import { UserEntity } from 'src/utils/entities';
import { useUserInfoStore } from 'src/stores/user-info-store';
import { AuthApi } from 'src/utils/api';

export default boot(({ app, store, router }) => {
  const eventBus = app.config.globalProperties.$eventBus;
  const userStore = useUserStore(store);
  const userInfoStore = useUserInfoStore(store);

  eventBus.on(EVENT_AUTH.LOGIN_SUCCESS, (payload) => {
    const iat = Math.floor(Date.now() / 1000);
    const typedPayload = payload as ILoginResponsePayload;
    userStore.$state.data = new UserEntity(typedPayload.user);
    userStore.$state.refreshToken = {
      ...typedPayload.refresh_token,
      iat: iat,
    };
    userStore.$state.accessToken = { ...typedPayload.access_token, iat: iat };
  });
  eventBus.on(EVENT_AUTH.LOGOUT_SUCCESS, () => {
    AuthApi.logout(userStore.refreshToken?.token);
    userStore.clear();
    userInfoStore.clear();
    sessionStorage.clear();
  });
  eventBus.on(EVENT_AUTH.REFRESH_TOKEN_UNVALIDATED, () => {
    userStore.clear();
    userInfoStore.clear();
    userStore.clearRefreshToken();
    sessionStorage.clear();
  });
  eventBus.on(EVENT_AUTH.REFRESH_TOKEN_REFRESHED, (data) => {
    const iat = Math.floor(Date.now() / 1000);
    const typedPayload = data as IRefreshTokensResponsePayload;
    userStore.$state.refreshToken = {
      ...typedPayload.refresh_token,
      iat: iat,
    };
    userStore.$state.accessToken = { ...typedPayload.access_token, iat: iat };
  });
});
