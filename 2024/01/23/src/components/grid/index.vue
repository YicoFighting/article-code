<template>
  <span class="grid-span">grid</span>
  <div class="grid">
    <section class="trigger-section">
      <p>1</p>
      <p>2</p>
      <p>3</p>
    </section>
  </div>
</template>

<style scoped>
.grid {
  width: 100px;
  text-align: center;
  display: grid;
  grid-template-rows: 0fr;
  transition: all 0.3s;
  overflow: hidden;
}

.grid .trigger-section {
  background-color: #ccc;
  min-height: 0;
  overflow: hidden;
}

.grid-span {
  cursor: pointer;
}

.grid-span:hover + .grid {
  grid-template-rows: 1fr;
}
</style>
