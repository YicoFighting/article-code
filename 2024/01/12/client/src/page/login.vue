<template>
  <button @click="openBPage">数字证书认证</button>
</template>

<script setup>
let bWindow = null;

const openBPage = () => {
  bWindow = window.open("/certificate?userId=123", "_blank");
};

const ws = new WebSocket("ws://localhost:3000?userId=123");

ws.onopen = (event) => {
  ws.send("Hello, server!");
};

ws.onmessage = function (event) {
  console.log(event.data);

  if (event.data === "认证成功") {
    console.log("该关闭并且跳转了");
    // 关闭 B 标签页
    bWindow.close();
    // A 标签页跳转至首页
    window.location.href = "http://localhost:5173";
  }
};

ws.onclose = (event) => {
  console.log("连接关闭");
};

ws.onerror = (event) => {
  console.error("连接发生错误:", event);
};
</script>
