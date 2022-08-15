<template>
  <div class="container">
    <div class="cube">
      <div class="side front">1</div>
      <div class="side back">2</div>
      <div class="side left">3</div>
      <div class="side right">4</div>
      <div class="side top"></div>
      <div class="side bottom"></div>
      <div class="axis X">X</div>
      <div class="axis Y">Y</div>
      <div class="axis Z"></div>
      <div class="line"></div>
      <div class="line2"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 400px;
  height: 400px;
  border: 2px solid white;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 800px;
  perspective-origin: 100% 0;
}
.cube {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  animation: cubeRotate 10s linear infinite;
  @keyframes cubeRotate {
    0%, 100% {
      transform: rotateY(360deg);
    }
    50% {
      transform: rotateY(180deg) ;
    }
  }
}
.side {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  border: 2px solid white;
  color: #000;
}
.axis {
  height: 100%;
  width: 100%;
  background: #000;
  opacity: 0.3;
  position: absolute;
  z-index: 1111;
}

.line {
  position: absolute;
  width: 283px;
  height: 100%;
  border: solid 1px red;
  transform-origin: 0 0;
  transform: translateZ(-100px) rotateY(-45deg) ;

}
.line2 {
  position: absolute;
  width: 283px;
  height: 100%;
  border: solid 1px blue;
  transform-origin: 0 0;
  transform: translateZ(100px) rotateY(45deg) ;
}
.X {
  transform: rotateY(90deg);
  background: red;
}
.Y {
  transform: rotateX(90deg);
}
.Z {
  transform: rotateZ(90deg);
}
.front {
  background-color: #d50000;
  transform: translateZ(100px);
}
.back {
  background-color: #aa00ff;
  transform: translateZ(-100px);
}

.left {
  background-color: #304ffe;
  transform: rotateY(-90deg) translateZ(-100px);
}
.right {
  background-color: #0091ea;
  transform: rotateY(90deg) translateZ(100px);
}

.top {
  background-color: #00bfa5;
  transform: rotateX(90deg) translateZ(100px);
}
.bottom {
  background-color: #64dd17;
  transform: rotateX(-90deg) translateZ(100px);
}

.front {
  background-color: #d50000;
  transform: translateZ(100px);
}

.back {
  background-color: #aa00ff;
  transform: translateZ(-100px);
}
// .left,.right,.back,.front {
//   animation: dd 10s linear infinite;
//   @keyframes dd {
//     0%, 100% {
//       height: 200px;
//     }
//     50% {
//       height: 100px;
//     }
//   }
// }
</style>
