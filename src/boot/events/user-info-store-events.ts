import { boot } from 'quasar/wrappers';
import { EVENT_USER_INFO_STORE } from '../event-bus';
import { ILoginResponsePayload } from 'src/utils/interfaces';
import { useUserInfoStore } from 'src/stores/user-info-store';
import { UserInfoApi } from 'src/utils/api/user-info.api';
import { UserInfoEntity } from 'src/utils/entities';

export default boot(({ app, store, router }) => {
  const eventBus = app.config.globalProperties.$eventBus;
  const userInfoStore = useUserInfoStore(store);
});
