import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("@/pages/home.vue") },
  { path: "/detectImg", component: () => import("@/pages/detect-img.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
