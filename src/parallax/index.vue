<template>
  <div class="hero">
    <div class="parallax-layer layer-4"></div>
    <div class="parallax-layer layer-5"></div>
    <div class="parallax-layer layer-2"></div>
    <div class="parallax-layer layer-6"></div>
    <div class="parallax-layer layer-1"></div>
    <div class="parallax-layer layer-3"></div>
  </div>
</template>

<style lang="scss">
.hero {
  width: 800px;
  // height: 100%;
  min-height: 250px;
  position: relative;
  top: 0;
  left: 0;
}
@each $index, $speed, $height in (1, 38s, 100px), (2, 10s, 500px),
  (3, 3s, 10px), (4, 85s, 180px), (5, 75s, 150px), (6, 55s, 250px), (7, 75s, 200px)
{
  .layer-#{$index} {
    animation: parallax_fg linear $speed infinite both;
    background: url('layer#{$index}.jpg')
      0
      100%
      repeat-x;
    z-index: 1;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: auto $height;
    // opacity: 0.9;
  }
}

@keyframes parallax_fg {  
  0% { background-position: 2765px 100%; } 
  100% {background-position: 550px 100%; } 
}
</style>
