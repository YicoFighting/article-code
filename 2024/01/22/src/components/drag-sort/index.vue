<template>
  <div class="wrap">
    <transition-group name="list" tag="div" class="box">
      <div
        class="box-item"
        v-for="(item, index) in list"
        :key="item.id"
        draggable="true"
        @dragstart="dragstart($event, index)"
        @dragenter="dragenter($event, index)"
        @dragend="dragend($event)"
        @dragover="dragover($event)"
      >
        {{ item.name }}
      </div>
    </transition-group>
    <div class="list">
      <div class="title">拖拽后排序</div>
      <div class="list-item" v-for="(item, index) in list" :key="item.id">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const list = ref([
  { name: "a", id: 1 },
  { name: "b", id: 2 },
  { name: "c", id: 3 },
  { name: "d", id: 4 },
  { name: "e", id: 5 },
]);

const dragIndex = ref(0);

const dragstart = (event, index) => {
  event.stopPropagation();
  dragIndex.value = index;
  // 开始移动时,将原来的透明度设为0
  // 不能使用nextTick
  setTimeout(() => {
    event.target.classList.add("moving");
  }, 0);
};
const dragenter = (event, index) => {
  event.preventDefault();
  // 拖拽到原位置时不触发
  if (dragIndex.value !== index) {
    // 拿到当前位置的数据
    const source = list.value[dragIndex.value];
    // 从dragIndex位置开始,截取一位
    list.value.splice(dragIndex.value, 1);
    // 从index位置 插入一位
    list.value.splice(index, 0, source);
    // 更新节点位置
    dragIndex.value = index;
  }
};
const dragover = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};
const dragend = (event) => {
  event.target.classList.remove("moving");
};
</script>

<style scoped>
.wrap {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 300px;
  display: flex;
}

.box {
  margin: 0 50px;
  padding-top: 50px;
}

.box-item {
  width: 200px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  background-color: skyblue;
  margin-bottom: 10px;
  cursor: move;
}

.moving {
  opacity: 0;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}

.list {
  padding-top: 50px;
}

.list .title {
  font-weight: bold;
}

.list-item {
  margin: 10px 0;
  color: skyblue;
}
</style>
