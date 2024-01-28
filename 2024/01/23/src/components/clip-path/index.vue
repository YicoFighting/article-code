<template>
  <span class="clip-path-span">clip-path</span>
  <div class="clip-path">
    <section class="trigger-section">
      <p>1</p>
      <p>2</p>
      <p>3</p>
    </section>
  </div>
</template>

<script setup></script>

<style scoped>
.trigger-section {
  width: 100px;
  text-align: center;
  background-color: #ccc;
  min-height: 0;
  overflow: hidden;
}

.clip-path {
  clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
  transition: all 0.3s;
}

.clip-path-span {
  cursor: pointer;
}

.clip-path-span:hover + .clip-path {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
</style>
