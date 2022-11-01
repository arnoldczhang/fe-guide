import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/home/index.vue'),
  },
  {
    path: '/detail/:index',
    name: 'detail',
    component: () => import('@/pages/detail/index.vue'),
  },
];

export const beforeEachHandlers = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  if (to.path === '/' && typeof to.name === 'undefined') {
    next({
      name: 'home',
    });
    return;
  }
  next();
};

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(beforeEachHandlers);

export default router;
