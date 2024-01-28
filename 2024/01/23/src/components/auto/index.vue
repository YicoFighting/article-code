<template>
  <span class="hover">auto</span>
  <div class="trigger">
    <p>1</p>
    <p>2</p>
    <p>3</p>
  </div>
</template>

<style scoped>
.trigger {
  width: 100px;
  height: 0;
  text-align: center;
  background-color: #ccc;
  overflow: hidden;
  transition: all 0.3s;
}

.hover {
  cursor: pointer;
}

.hover:hover + .trigger {
  height: auto;
}
</style>
