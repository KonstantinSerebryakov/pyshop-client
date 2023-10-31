import { boot } from 'quasar/wrappers';
import mitt, { Emitter } from 'mitt';

const eventBus = mitt();

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $eventBus: typeof eventBus;
  }
}

const enum EVENT_AUTH {
  LOGIN_SUCCESS = 'EVENT_AUTH_LOGIN_SUCCESS',
  LOGOUT_SUCCESS = 'EVENT_AUTH_LOGOUT_SUCCESS',
}

export default boot(({ app }) => {
  app.config.globalProperties.$eventBus = eventBus;
});

export { eventBus, EVENT_AUTH };
