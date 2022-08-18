<template>
  <div class="container flex items-center justify-center">
    <div class="card"></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 300px;
  aspect-ratio: 1;
  background: #000;
}
$t: 3s;
.card {
  width: 100px;
  aspect-ratio: 1;
  background: #fff;
  position: absolute;
  mix-blend-mode: difference;
  background-blend-mode: difference;
  animation: rotate $t infinite linear;
  &::after,
  &::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #fff 50%, transparent 0);
    mix-blend-mode: difference;
  }
  &::before {
    right: -50px;
    top: -50px;
    background: linear-gradient(225deg, #fff 50%, transparent 0);
    animation: rotate3 $t infinite linear;
    @keyframes rotate3 {
      0%,
      100% {
      }
      50% {
        right: 0;
        top: 0;
      }
    }
  }
  &::after {
    left: -50px;
    bottom: -50px;
    animation: rotate2 $t infinite linear;
    @keyframes rotate2 {
      0%,
      100% {
      }
      50% {
        left: 0;
        bottom: 0;
      }
    }
  }
  @keyframes rotate {
    0%,
    100% {
      transform: rotate(-45deg);
    }
    50% {
      transform: rotate(45deg);
    }
  }
}
</style>
