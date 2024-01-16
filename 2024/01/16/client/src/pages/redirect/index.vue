<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const loginAction = async (code: string) => {
  const res = await axios.get("https://github-admin-sooty.vercel.app/auth", {
    params: {
      code,
    },
  });
  const { access_token, token_type } = res.data;
  const token = `${token_type} ${access_token}`;
  const result = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: token,
    },
  });
  const { avatar_url, login } = result.data;
  localStorage.setItem(
    "github",
    JSON.stringify({
      avatar_url,
      login,
      token,
    })
  );
  router.replace("/");
};

onMounted(() => {
  const route = useRoute();
  const code = route.query.code as string;
  if (code) {
    loginAction(code);
  } else {
    router.replace("/login");
  }
});
</script>

<template>
  <div class="page">登录中...</div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
