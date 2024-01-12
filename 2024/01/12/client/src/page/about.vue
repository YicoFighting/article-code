<template>about</template>

<script setup>
import axios from "axios";

axios
  .get("http://localhost:3000/redirect", {
    params: {
      redirect_url: "/detail",
    },
  })
  .then((res) => {
    // 这里相当于是获取重定向之后的请求
    window.location = res.request.responseURL;
  });
</script>
