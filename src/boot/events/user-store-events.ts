import { boot } from 'quasar/wrappers';
import { useUserStore } from 'src/stores/user-store';
import { EVENT_AUTH } from '../event-bus';
import { ILoginResponsePayload } from 'src/utils/interfaces';

export default boot(({ app, store, router }) => {
  const eventBus = app.config.globalProperties.$eventBus;
  const userStore = useUserStore(store);

  eventBus.on(EVENT_AUTH.LOGIN_SUCCESS, (payload) => {
    const typedPayload = payload as ILoginResponsePayload;
    userStore.$state.data = typedPayload.user;
    userStore.$state.token = typedPayload.token;
  });
  eventBus.on(EVENT_AUTH.LOGOUT_SUCCESS, () => {
    userStore.clear();
    localStorage.clear();
    sessionStorage.clear();
  });
});
