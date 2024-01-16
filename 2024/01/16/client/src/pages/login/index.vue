<script setup lang="ts">
const login = async () => {
  const state = Math.floor(Math.random() * Math.pow(10, 8));
  window.location.href =
    "https://github.com/login/oauth/authorize?client_id=CLIENT_ID&redirect_uri=https://githubauth.vercel.app/redirect&state=" +
    state;
};
</script>

<template>
  <div class="page">
    <button @click="login">登录</button>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    padding: 5px 15px;
  }
}
</style>
