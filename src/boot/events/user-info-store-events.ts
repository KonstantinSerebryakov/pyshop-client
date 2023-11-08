import { boot } from 'quasar/wrappers';
import { EVENT_USER_INFO_STORE } from '../event-bus';
import { ILoginResponsePayload } from 'src/utils/interfaces';
import { useUserInfoStore } from 'src/stores/user-info-store';

export default boot(({ app, store, router }) => {
  const eventBus = app.config.globalProperties.$eventBus;
  const userInfoStore = useUserInfoStore(store);

  eventBus.on(EVENT_USER_INFO_STORE.ADDRESS_PICKED, (payload) => {
    const address = payload as string;
    if (userInfoStore.$state.data) {
      userInfoStore.$state.data.address = address;
    }
  });
});
