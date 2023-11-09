import { useUserStore } from 'src/stores/user-store';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/signin',
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    beforeEnter: (to, from) => {
      const userStore = useUserStore();
      const path = `./signin?from=${to.path}`;
      if (userStore.$state.token) return true;
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
