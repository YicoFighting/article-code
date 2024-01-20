<template>
  <div class="app">
    <div class="load" v-if="loading">模型加载中...</div>
    <div class="load" v-else-if="loadError">模型加载中...</div>
    <div class="content" v-else>
      <video
        id="video"
        ref="video"
        crossorigin="anonymous"
        :src="test"
        controls
      ></video>

      <!-- <canvas id="canvas"></canvas> -->

      <img :src="Base64" alt="" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, shallowRef } from "vue";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/selfie_segmentation";

import test from "./assets/test.mp4";

// 视频实例
const video = shallowRef(null);

// 用于清除 requestAnimationFrame
const task = shallowRef(null);

// 模板图片
const Base64 = shallowRef(null);

// 加载状态及加载失败
const loading = shallowRef(false);
const loadError = shallowRef(false);

const segmenter = shallowRef(null);

// 加载模型
const loadModel = async () => {
  try {
    loading.value = true;
    const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
    const segmenterConfig = {
      runtime: "mediapipe", // or 'tfjs'
      solutionPath:
        "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
      modelType: "general",
    };
    segmenter.value = await bodySegmentation.createSegmenter(
      model,
      segmenterConfig
    );
    loading.value = false;
  } catch (error) {
    loading.value = false;
    loadError.value = true;
  }
};

// 获取视频每一帧的图片数据
const compressionImage = (el) => {
  return new Promise(async (resolve) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // 视频尺寸
    const elRect = el.getBoundingClientRect();
    const originWidth = elRect.width;
    const originHeight = elRect.height;

    // canvas对图片进行缩放
    canvas.width = originWidth;
    canvas.height = originHeight;

    // 清除画布
    context.clearRect(0, 0, originWidth, originHeight);

    // 压缩
    context.drawImage(el, 0, 0, originWidth, originHeight);

    // 获取图片数据
    const imageData = context.getImageData(0, 0, originWidth, originHeight);

    resolve(imageData);
  });
};

// 用于生成蒙版
const recognition = async () => {
  const imageData = await compressionImage(video.value);

  const segmentationConfig = {
    flipHorizontal: false,
    multiSegmentation: false,
    segmentBodyParts: true,
    segmentationThreshold: 1,
  };

  const segmentation = await segmenter.value.segmentPeople(
    imageData,
    segmentationConfig
  );

  const foregroundColor = { r: 0, g: 0, b: 0, a: 0 };
  const backgroundColor = { r: 0, g: 0, b: 0, a: 255 };
  const backgroundDarkeningMask = await bodySegmentation.toBinaryMask(
    segmentation,
    foregroundColor,
    backgroundColor,
    false,
    0.3
  );

  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = backgroundDarkeningMask.width;
  canvas.height = backgroundDarkeningMask.height;
  ctx.putImageData(backgroundDarkeningMask, 0, 0);
  Base64.value = canvas.toDataURL("image/png");
  task.value = requestAnimationFrame(recognition);
};

onMounted(async () => {
  await loadModel();

  video.value.addEventListener("play", async () => {
    task.value = requestAnimationFrame(recognition);
  });

  video.value.addEventListener("pause", () => {
    if (task.value) {
      cancelAnimationFrame(task.value);
      task.value = null;
    }
  });
});
</script>

<style scoped>
.app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.load {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}
#video {
  width: 200px;
}
</style>
