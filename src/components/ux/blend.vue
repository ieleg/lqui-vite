<template>
  <div class="container">
    <div class="card">
      <div class="top"></div>
      <div class="bottom"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  perspective: 800px;
  perspective-origin: 90% -50%;
}
.card {
  height: 200px;
  width: 200px;
  transform-style: preserve-3d;

  &:hover {
    .bottom {
      transform: translateY(-200px) rotateX(0deg);
      mix-blend-mode: difference;
    }
    .top {
      transform: rotateX(0deg);
    }
  }
}
.top,
.bottom {
  height: 100%;
  width: 100%;
}
.top {
  transition: all 0.3s;
  background: conic-gradient(
      #000 0% 10%,
      #fff 0% 20%,
      #000 0% 30%,
      #fff 0% 40%,
      #000 0% 50%,
      #fff 0% 60%,
      blue 0% 70%,
      blue 0% 80%,
      yellow 0% 90%,
      yellow 0%
    );
  // background: blue;
  transform: rotateX(90deg);
}
.bottom {
  background: conic-gradient(
      #000 0% 10%,
      #fff 0% 20%,
      blue 0% 30%,
      blue 0% 40%,
      yellow 0% 50%,
      yellow 0% 60%,
      #000 0% 70%,
      #fff 0% 80%,
      #000 0% 90%,
      #fff 0%
    );
  transition: all 0.3s;
  transform: translateY(-150px) rotateX(90deg);
}
</style>
