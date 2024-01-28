<template>
  <button id="click-button">展开收起</button>
  <section id="trigger-section" class="trigger-section" style="display: none">
    <p>1</p>
    <p>2</p>
    <p>3</p>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
onMounted(() => {
  let ref = document.getElementById("trigger-section");
  // 元素真实高度
  let offsetHeight = 0;
  // 定时器每一次执行高度
  let stepHeight = 0;
  // 展开定时器
  let expandTimerRef = null;
  // 收起定时器
  let collapseTimerRef = null;

  // 按钮点击
  const handleClick = () => {
    // 收起
    if (expandTimerRef) {
      clearInterval(expandTimerRef);
      expandTimerRef = null;

      // 获取DOM元素高度
      let height = ref.offsetHeight;

      collapseTimerRef = setInterval(() => {
        height -= stepHeight;

        if (height <= 0) {
          clearInterval(collapseTimerRef);

          offsetHeight = 0;
          // 这里一定要这么写
          ref.style.height = null;
          ref.style.display = "none";

          return;
        }

        // 设置DOM元素高度
        ref.style.height = height + "px";
      }, 10);
    } else {
      // 展开
      clearInterval(collapseTimerRef);
      collapseTimerRef = null;

      ref.style.display = "block";
      let height = 0;

      // 所以只有在收起之后 offsetHeight才为0，要不然就为全高的高度
      if (!offsetHeight) {
        offsetHeight = ref.offsetHeight;
      } else {
        // 来回滚动时 元素的高度
        height = ref.offsetHeight;
      }

      // 每一次定时器执行的高度
      stepHeight = offsetHeight / 30;
      ref.style.height = height + "px";

      expandTimerRef = setInterval(() => {
        height += stepHeight;
        if (height >= offsetHeight) {
          clearInterval(expandTimerRef);
          expandTimerRef = 1;
          ref.style = null;
          return;
        }
        ref.style.height = height + "px";
      }, 10);
    }
  };

  const button = document.getElementById("click-button");
  button.addEventListener("click", handleClick, false);
});
</script>

<style scoped>
.trigger-section {
  width: 100px;
  text-align: center;
  background-color: #ccc;
  min-height: 0;
  overflow: hidden;
}
</style>
