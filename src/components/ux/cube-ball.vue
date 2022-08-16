<template>
  <div class="container">
    <div class="ball"></div>
    <div class="shadow"></div>
    <div class="cube">
      <div class="front"></div>
      <div class="back"></div>
      <div class="left"></div>
      <div class="right"></div>
      <div class="bottom"></div>
      <div class="top"></div>
    </div>
    <div class="floor"></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 800px;
  width: 800px;
  perspective: 1800px;
  perspective-origin: 0 30%;
  position: relative;
  // animation: cubeRotate 10s linear infinite;
  @keyframes cubeRotate {
    from {
      perspective-origin: -100% 30%;
    }
    to {
      perspective-origin: 100% 30%;
    }
  }
}
.cube {
  position: absolute;
  width: 100px;
  height: 100px;
  transform-style: preserve-3d;
  bottom: 250px;
  z-index: 1;
  & > div {
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(to top, #000, #fff);
    box-shadow: 0 0 1px #ddd;
  }
  .front {
    transform: translateZ(50px);
  }
  .back {
    transform: translateZ(-50px);
  }
  .left {
    transform: translateX(50px) rotateY(90deg);
  }
  .right {
    transform: translateX(-50px) rotateY(90deg);
  }
  .top {
    --blur: 1px;
    transform: translateY(-50px) rotateX(90deg);
    background: radial-gradient(#000 var(--blur), #fff, #fff);
    animation: shadow 3s ease-out infinite;
    @keyframes shadow {
      0%,
      100% {
        --blur: 1px;
      }
      50% {
        --blur: 11px;
        animation-timing-function: ease-in;
      }
    }
  }
  .bottom {
    transform: translateY(50px) rotateX(90deg);
  }
  // .left,.right,.front,.back {
  //       animation: bounce 3s ease-out infinite;
  //   @keyframes bounce {
  //     0%,
  //     100% {
  //       height: 100%;
  //     }
  //     50% {
  //       height: 80%;
  //       animation-timing-function: ease-in;
  //     }
  //   }
  // }
}
.ball {
  width: 40px;
  aspect-ratio: 1;
  background: red;
  background: linear-gradient(to top, #000 10%, #fff);
  position: absolute;
  border-radius: 50%;
  bottom: 350px;
  z-index: 2;
  animation: jump 3s ease-out infinite;
  @keyframes jump {
    0%,
    100% {
      bottom: 350px;
    }
    50% {
      bottom: 400px;
      animation-timing-function: ease-in;
    }
  }
}
.floor {
  position: absolute;
  bottom: 0;
  height: 500px;
  aspect-ratio: 1;
  background: conic-gradient(
      #eee 90deg,
      #000 0 180deg,
      #eee 0 270deg,
      #000 0 360deg
    )
    center / 100px 100px;
  transform: rotateX(90deg);
  &::after {
    content: "";
    background: radial-gradient(transparent 2%, #000);
    inset: 0;
    position: absolute;
  }
}
</style>

<style>
body {
  background: #000;
}
</style>
