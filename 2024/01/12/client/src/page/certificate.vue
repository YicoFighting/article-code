<template>
  <p>数字证书认证页</p>
</template>

<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
const route = useRoute();
const userId = route.query.userId;
axios
  .post("http://localhost:3000/auth", {
    userId,
  })
  .then((res) => {
    console.log(res.data);
  })
  .catch((error) => {
    console.log(error);
  });
</script>
