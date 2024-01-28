<template>
  <div class="course">
    <div class="title">课程表</div>
    <div class="course-body">
      <div
        class="left"
        @drop="drop2"
        @dragover="dragover2"
        @dragenter="dragenter2"
      >
        <div
          class="item"
          v-for="(course, index) in courses"
          :key="course"
          :style="{ background: colors[index] }"
          :draggable="true"
          @dragstart="dragstart"
        >
          {{ course }}
        </div>
      </div>
      <div class="right">
        <div
          class="item"
          v-for="item in 20"
          :key="item"
          @dragover="dragover"
          @dragenter="dragenter"
          @drop="drop"
          @dragstart="dragstart2"
          :data-drop="true"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const courses = ["语文", "数学", "英语", "物理", "化学", "生物"];
const colors = [
  "#EDFFAB",
  "#717C89",
  "#8AA2A9",
  "#90baad",
  "#4c5b5c",
  "#BD9391",
];

let source;
// 记录从左往右拖，上一次激活的item
const activeEl = ref(null);
// 是否右边拖动到右边
const isDragStart2 = ref(false);

// 从左往右边拖，记录target
const dragstart = (e) => {
  e.dataTransfer.effectAllowed = "copy";
  source = e.target;
};

/** 指向目标元素 */
const dragover = (e) => {
  // 阻止默认行为,允许其他元素放置在其上方
  e.preventDefault();
};

/** 指向目标元素,只执行一次 */
const dragenter = (e) => {
  activeEl.value && activeEl.value.classList.remove("active");
  activeEl.value = e.target;
  e.target.classList.add("active");
};

// 找到可放置父节点
const findDropElement = (ele) => {
  while (ele && !ele.dataset.drop) {
    ele = ele.parentNode;
  }
  return ele;
};

// 放置节点
const drop = (e) => {
  // 右边拖到右边
  if (isDragStart2.value) {
    // 移除原先的元素
    source.parentNode.removeChild(source);
    isDragStart2.value = false;
  }
  // 找到可放置的节点
  const node = findDropElement(e.target);
  // 移除激活
  activeEl.value && activeEl.value.classList.remove("active");
  // 克隆节点
  node.innerHTML = "";
  const cloned = source.cloneNode(true);
  node.appendChild(cloned);
  source = null;
};

// 从右往左拖
const dragstart2 = (e) => {
  isDragStart2.value = true;
  e.dataTransfer.effectAllowed = "move";
  source = e.target;
};

// 允许放置
const dragover2 = (e) => {
  e.preventDefault();
};

const dragenter2 = (e) => {};

// 放置
const drop2 = (e) => {
  if (isDragStart2.value) {
    // 移除原先的元素
    source.parentNode.removeChild(source);
    isDragStart2.value = false;
  }
};
</script>

<style scoped>
.active {
  background-color: #ccc;
}

.course {
  width: 100%;
  height: 350px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.course .title {
  text-align: center;
}

.course-body {
  flex: 1 0 0;
  display: flex;
  gap: 20px;
}

.course-body .left {
  width: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.course-body .left .item {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.course-body .right {
  flex: 1 0 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
}

.course-body .right .item {
  border: 1px solid #ccc;
}
</style>
