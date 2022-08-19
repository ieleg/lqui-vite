<template>
  <div class="container flex items-center justify-center">
    <div class="card" />
    <div class="card" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 300px;
  aspect-ratio: 1;
  background: #000;
  // filter: contrast(.95);
  overflow: hidden;
}
$t: 3s;
.card {
  --isSecond: var(--2nflag, 0);
  --isFirst: calc(1 - var(--isSecond));
  padding: 50px;
  position: absolute;
  mix-blend-mode: difference;
  transform: rotate(calc(var(--isSecond) * 90deg + 45deg)) scale(0.71);
  animation: innerRotate $t infinite cubic-bezier(0.09, 0.65, 0.91, 0.34);
  box-sizing: border-box;
    border-radius: 50%;

  &:nth-child(2n) {
    --2nflag: 1;
  }
  &::before,
  &::after {
    --afterFlag: 0;
    --x: calc((2 * var(--afterFlag) - 1) * 50%); //before: -50% after 50%
    background: #fff;
    inset: 0;
    position: absolute;
    border-radius: 50%;
    clip-path: polygon(50% 0, 50% 100%, calc(var(--afterFlag) * 100%) 50%);
    content: "";
    transform: rotate(calc(var(--isSecond) * 45deg))
      scale(calc(var(--isFirst) + var(--isSecond) * 1.41))
      translate(calc(var(--isFirst) * var(--x)));

    animation: outRotate $t infinite cubic-bezier(0.41, 0.52, 0.68, 0.48);
    animation-direction: var(--2nflag, reverse);
  }
  &::after {
    --afterFlag: 1;
    clip-path: polygon(49% 0, 49% 100%, calc(var(--afterFlag) * 100%) 50%);
  }
}
@keyframes innerRotate {
  0% {
    transform: rotate(calc(var(--isSecond) * 90deg));
  }
}
@keyframes outRotate {
  50%,
  100% {
    transform: translate(calc(var(--isSecond) * var(--x)));
  }
}
</style>
