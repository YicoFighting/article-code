<template>
  <div class="wrapper">
    <div class="btns">
      <button
        v-for="item in list"
        :key="item.title"
        @click="active = item"
        :class="[active.title === item.title ? 'active' : '']"
      >
        {{ item.title }}
      </button>
    </div>
    <component :is="active.component"></component>
  </div>
</template>

<script setup>
import { shallowRef } from "vue";
import auto from "./components/auto/index.vue";
import MaxHeight from "./components/max-height/index.vue";
import grid from "./components/grid/index.vue";
import ClipPath from "./components/clip-path/index.vue";
import javascript from "./components/javascript/index.vue";

const list = [
  {
    title: "auto",
    component: auto,
  },
  {
    title: "max-height",
    component: MaxHeight,
  },
  {
    title: "grid",
    component: grid,
  },
  {
    title: "clip-path",
    component: ClipPath,
  },
  {
    title: "javascript",
    component: javascript,
  },
];

const active = shallowRef(list[0]);
</script>

<style scoped>
.wrapper {
  width: 800px;
  margin: 0 auto;
}
.btns {
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
