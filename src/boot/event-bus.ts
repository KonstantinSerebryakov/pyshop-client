import { boot } from 'quasar/wrappers';
import mitt from 'mitt';

export const eventBus = mitt();

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $eventBus: typeof eventBus;
  }
}

export const enum EVENT_AUTH {
  LOGIN_SUCCESS = 'EVENT_AUTH_LOGIN_SUCCESS',
  LOGOUT_SUCCESS = 'EVENT_AUTH_LOGOUT_SUCCESS',
  REFRESH_TOKEN_UNVALIDATED = 'REFRESH_TOKEN_UNVALIDATED',
  REFRESH_TOKEN_REFRESHED = 'REFRESH_TOKEN_REFRESHED',
}

export default boot(({ app }) => {
  app.config.globalProperties.$eventBus = eventBus;
});
