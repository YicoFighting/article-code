<template>
  <div class="page">
    <div class="loading" v-if="loading">模型加载中...</div>
    <div class="error" v-else-if="error">模型加载失败！</div>
    <div class="video" v-else>
      <div class="content">
        <video ref="videoRef" autoplay muted></video>
        <span>您当前的表情是：{{ emotion }}</span>
      </div>
      <el-button type="primary" @click="startVideo">开始视频检测</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from "vue";
import { useLoadModel, useDetectVideoFace } from "@/hooks/useFaceApi";

// 加载模型状态，加载模式失败
const { loading, error } = useLoadModel();

// 视频实例
const videoRef = shallowRef(null);
// 表情文字
const emotion = ref("");

// 获取摄像头权限并启动视频流
const startVideo = async () => {
  const video = videoRef.value;
  if (!video) return;
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;
  // 等待视频开始播放
  await new Promise((resolve) => (video.onplaying = resolve));
  useDetectVideoFace(video, (emotionStr) => {
    emotion.value = emotionStr;
  });
};
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.loading,
.error {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content {
  position: relative;
  width: 500px;
  height: 300px;
}
.content video {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  object-fit: cover;
}

.content span {
  position: absolute;
  top: 20px;
  right: -50px;
  background-color: #ccc;
}

.video .el-button {
  margin-top: 20px;
}
</style>
