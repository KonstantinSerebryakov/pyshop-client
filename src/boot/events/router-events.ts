import { boot } from 'quasar/wrappers';
import { EVENT_AUTH } from '../event-bus';

export default boot(({ app, store, router }) => {
  const eventBus = app.config.globalProperties.$eventBus;

  eventBus.on(EVENT_AUTH.LOGIN_SUCCESS, (payload) => {
    const query = router.currentRoute.value.query;
    const path = query['from']?.toString() ?? '/';
    if (['/signin', '/signup'].includes(path)) {
      router.push('/');
    } else {
      router.push(path);
    }
  });
  eventBus.on(EVENT_AUTH.LOGOUT_SUCCESS, () => {
    console.log('EVEENT_logout');
    const currentRoute = router.currentRoute.value.path;
    const path = `/signin?from=${currentRoute}`;
    router.push(path);
  });
  eventBus.on(EVENT_AUTH.REFRESH_TOKEN_UNVALIDATED, () => {
    console.log('EVEENT_refreshUnvalid');
    const currentRoute = router.currentRoute.value.path;
    const path = `/signin?from=${currentRoute}`;
    router.push(path);
  });
});
