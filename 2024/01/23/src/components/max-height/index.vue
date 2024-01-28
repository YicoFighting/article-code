<template>
  <span class="max-height">max-height</span>
  <div class="trigger">
    <p>1</p>
    <p>2</p>
    <p>3</p>
  </div>
</template>

<style scoped>
.trigger {
  width: 100px;
  height: unset;
  max-height: 0;
  text-align: center;
  background-color: #ccc;
  overflow: hidden;
  transition: all 0.3s;
}

.max-height {
  cursor: pointer;
}

.max-height:hover + .trigger {
  max-height: 400px;
}
</style>
