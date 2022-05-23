<template>
  <div
    ref="progress"
    class="lq-progress"
    @mousemove="mouseenter"
    @mouseleave="leave"
  >
    <div
      v-show="value > 0"
      class="lq-progress-bar"
      :class="classes"
      role="lq-progressbar"
      :valueNow="value"
      :valueMin="0"
      :valueMax="total"
      :style="{ width: (value < 100 ? value : 100) + '%' }"
    >
      <div
        v-show="seen && showToolTip"
        ref="edittool"
        class="lq-progress-bar-edittool"
      >
        <slot name="tip" />
      </div>
      <div v-if="value" class="lq-progress-bar-label">
        <slot name="label" />
      </div>
    </div>
    <!-- <div v-if="value === 0" class="lq-progress-label">
      <slot name="label" />
    </div> -->
    <label v-if="total === 0">暂无数据</label>
  </div>
</template>

<script>
export default {
  name: "Lqprogress",
  props: {
    /**
     * 是否显示弹窗
     */
    showToolTip: {
      type: Boolean,
      default: true
    },
    /**
     * 分子
     */
    part: {
      type: Number,
      default: 10
    },
    /**
     * 分母
     */
    total: {
      type: Number,
      default: 100
    }
  },

  data() {
    return {
      seen: false
    }
  },
  computed: {
    value() {
      return Math.round((this.part / this.total) * 100)
    },
    classes() {
      const percent = this.value
      if (percent < 50) {
        return { "lq-progress-bar-blue": true }
      }
      if (percent >= 50 && percent < 80) {
        return { "lq-progress-bar-yellow": true }
      }
      return { "lq-progress-bar-red": true }
    }
  },
  methods: {
    leave() {
      this.seen = false
      this.$refs.progress.style.cursor = "default"
    },
    mouseenter(e) {
      // console.log(e);
      const { offsetX, offsetY } = e
      console.log(e)
      this.$refs.edittool.style.left = `${offsetX - 65}px`
      this.$refs.edittool.style.top = `${offsetY - 80}px`
      this.$refs.progress.style.cursor = "pointer"
      this.seen = true
    }
  }
}
</script>

<style lang="scss">
.lq-progress-bar-edittool {
  position: absolute;
  z-index: 999;
  top: 0;
  width: 130px;
  height: 60px;
  box-sizing: border-box;
  padding: 1em;
  background: #fff;
  color: #353c47;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));

  &::after {
    position: absolute;
    z-index: 1000;
    bottom: -8px;
    left: 50%;
    width: 0;
    height: 0;
    border-top: 10px solid #fff;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    content: "";
    transform: translateX(-50%);
  }
}

.lq-progress {
  // box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
  position: relative;
  width: 400px;
  height: 8px;
  margin-bottom: 10px;
  background-color: rgba(134, 178, 236, 0.13);
  border-radius: 4px;
  float: left;
  // 扩大事件范围
  &::after {
    position: absolute;
    top: -10px;
    right: -10px;
    bottom: -10px;
    left: -10px;
    content: "";
  }

  &-label {
    position: absolute;
    top: 0;
    left: 0;
    color: #5b91fd;
    pointer-events: none;
    transform: translate(0%, -150%);
  }

  &-bar {
    position: relative;
    width: 0;
    height: 100%;
    margin-bottom: 10px;
    border-radius: 4px / 4px 0 0 4px;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.1) inset;
    line-height: 20px;

    &-label {
      position: absolute;
      top: 0;
      right: 0;
      display: inline-block;
      width: 400px;
      pointer-events: none;
      text-align: center;
      transform: translate(50%, -150%);
    }

    @mixin line($color) {
      &::after {
        position: absolute;
        right: -0;
        width: 1px;
        height: 16px;
        background: linear-gradient(
          to top,
          $color 20%,
          transparent 0,
          transparent 80%,
          $color 0
        );
        content: "";
        transform: translateY(-25%);
      }
    }

    &-blue {
      background: linear-gradient(90deg, #86b3ec 0%, #4783ff 100%);
      color: #5b91fd;

      @include line(#5b91fd);
    }

    &-yellow {
      background: linear-gradient(90deg, #fdc220 0%, #fd8c20 100%);
      color: #fd8c20;

      @include line(#fd8c20);
    }

    &-red {
      background: linear-gradient(90deg, #ec86bc 0%, #fd4378 100%);
      color: #fd4378;

      @include line(#fd4378);
    }
  }
}
</style>
