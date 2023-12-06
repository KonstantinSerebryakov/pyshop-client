/* eslint-disable @typescript-eslint/no-unused-vars */
import { useUserStore } from 'src/stores/user-store';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/signin',
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        beforeEnter: (_to, _from, next) => {
          // if (to.path !== from.path) {
          //   eventBus.emit(EVENT_USER_INFO_STORE.REQUIRED, null);
          // }
          next();
        },
      },
    ],
    beforeEnter: (to, _from) => {
      const userStore = useUserStore();
      const path = `./signin?from=${to.path}`;
      if (userStore.$state.refreshToken) return true;
      else return path;
    },
  },
  {
    path: '/signin',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignInPage.vue') }],
  },
  {
    path: '/signup',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignUpPage.vue') }],
  },
  {
    path: '/oauth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'success', component: () => import('pages/OAuthSuccess.vue') },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
