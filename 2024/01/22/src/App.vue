<template>
  <div class="wrapper">
    <button
      v-for="item in list"
      :key="item.title"
      @click="active = item"
      :class="[active.title === item.title ? 'active' : '']"
    >
      {{ item.title }}
    </button>
    <component :is="active.component"></component>
  </div>
</template>

<script setup>
import { shallowRef } from "vue";
import curriculum from "./components/curriculum/index.vue";
import DragSort from "./components/drag-sort/index.vue";

const list = [
  {
    title: "课程表",
    component: curriculum,
  },
  {
    title: "拖拽排序",
    component: DragSort,
  },
];

const active = shallowRef(list[0]);
</script>

<style scoped>
.wrapper {
  width: 800px;
  margin: 0 auto;
  text-align: center;
}
button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 32px;
  white-space: nowrap;
  cursor: pointer;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: 0.1s;
  font-weight: 500;
  user-select: none;
  vertical-align: middle;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-color: #dcdfe6;
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 4px;
  margin: 10px;
}

button:hover,
button:focus {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
  outline: none;
}

.active {
  color: #409eff;
  border-color: #409eff;
  background-color: #ecf5ff;
  outline: none;
}
</style>
