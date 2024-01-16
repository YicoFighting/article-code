<template>
  <div class="home">
    <div class="avatar">
      <img :src="user?.avatar_url" alt="" />
    </div>
    <span class="username">{{ username }}</span>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
type userType = {
  avatar_url?: string;
  login?: string;
};
const user = ref<userType>({});
const username = ref("");
const timers = ref<(number | NodeJS.Timeout)[]>([]); // 用于存储定时器ID

const printText = () => {
  if (user.value.login) {
    for (let i = 0; i < user.value.login.length; i++) {
      const timer = setTimeout(() => {
        username.value += user.value.login![i];
      }, i * 400);
      timers.value.push(timer); // 将定时器ID添加到数组中
    }
  }
};
onMounted(() => {
  const github = localStorage.getItem("github");
  if (github) {
    const { avatar_url, login } = JSON.parse(github);
    user.value = { avatar_url, login };
    printText();
  }
});

onBeforeUnmount(() => {
  // 清除所有的定时器
  timers.value.forEach((timer) => {
    clearTimeout(timer);
  });
});
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid #ccc;
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
}
.username {
  margin-top: 10px;
}
</style>
