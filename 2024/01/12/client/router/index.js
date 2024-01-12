import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("../src/page/index.vue") },
  { path: "/about", component: () => import("../src/page/about.vue") },
  { path: "/detail", component: () => import("../src/page/detail.vue") },
  { path: "/login", component: () => import("../src/page/login.vue") },
  {
    path: "/certificate",
    component: () => import("../src/page/certificate.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
