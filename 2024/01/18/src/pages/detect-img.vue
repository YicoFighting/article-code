<template>
  <div class="detect">
    <div class="loading" v-if="loading">模型加载中...</div>
    <div class="error" v-else-if="error">模型加载失败！</div>
    <div class="content" v-else>
      <el-upload
        class="upload-demo"
        ref="upload"
        drag
        accept="image/png, image/jpeg"
        :auto-upload="false"
        :limit="1"
        v-model:file-list="fileList"
        :on-exceed="onExceedFile"
        :show-file-list="false"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件放在此处或 <em>单击上传</em></div>
      </el-upload>

      <div class="image-list">
        <div class="item" v-for="(image, index) in fileList" :key="index">
          <img :src="genImgUrl(image.raw)" :alt="image.name" />
          <span class="emotion">
            这张图片的表情是：{{ emotions[index] ?? "计算中..." }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, watch } from "vue";
import { genFileId } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { useLoadModel, useDetectImageFace } from "@/hooks/useFaceApi";

// 加载模型状态，加载模式失败
const { loading, error } = useLoadModel();

// 上传组件实例
const upload = shallowRef(null);
// 文件列表
const fileList = ref([]);
const emotions = ref([]);

// 生成文件列表对应图片
const genImgUrl = (raw) => {
  return URL.createObjectURL(raw);
};

// 超出文件限制
const onExceedFile = (files, uploadFiles) => {
  // 清空文件
  upload.value.clearFiles();
  const file = files[0];
  // 生成文件 uid
  file.uid = genFileId();
  // 将文件状态设置为ready
  upload.value.handleStart(file);
};

watch(fileList, async (newFileList) => {
  try {
    const emotionsResult = await Promise.all(
      newFileList.map((file) => useDetectImageFace(file.raw))
    );
    emotions.value.push(...emotionsResult);
  } catch (error) {
    console.log("模型运行出错");
  }
});
</script>

<style scoped>
.detect {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 50px;
}

.loading,
.error {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.image-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.emotion {
  margin-top: 10px;
}
.image-list img {
  width: 400px;
  object-fit: cover;
  vertical-align: middle;
  border-radius: 10px;
}
</style>
