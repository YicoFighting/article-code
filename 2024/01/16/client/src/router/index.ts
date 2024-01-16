import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("@/pages/home/index.vue") },
  { path: "/login", component: () => import("@/pages/login/index.vue") },
  { path: "/redirect", component: () => import("@/pages/redirect/index.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const whiteList = ["/login", "/redirect"];

router.beforeEach(async (to, _from, next) => {
  if (whiteList.indexOf(to.path) !== -1) return next();
  const github = localStorage.getItem("github");
  if (github) {
    next();
  } else {
    next({ path: "/login" });
  }
});

export default router;
