import { boot } from 'quasar/wrappers';
import { useUserInfoStore } from 'src/stores/user-info-store';

export default boot(({ app, store, router }) => {
  const eventBus = app.config.globalProperties.$eventBus;
  const userInfoStore = useUserInfoStore(store);
});
