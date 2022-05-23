<template>
  <div class="container">
    <div v-if="show" :class="[`container-left-parent`, leftTurn]">
      <span v-if="isShow" class="iconfont iconfanye-zuo" @click="pre">
        <slot name="left">1</slot>
      </span>
    </div>
    <div v-if="show" :class="[`container-right-parent`, rightTurn]">
      <span v-if="isShow" class="iconfont iconfanye-you" @click="next">
        <slot name="right">2</slot>
      </span>
    </div>
    <div ref="box" :class="[`container-swiper-parent`]">
      <div
        v-for="(item, index) in list"
        :key="index"
        ref="list"
        :class="[searchForm.index == index ? 'active' : '', 'card']"
        :style="`width: calc(${100 / showLength}%)`"
        @click="handleClick(index, item)"
      >
        <slot :item="item">
          {{ index }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    type: {
      type: String,
      default: "step",
      validator: value => ["step", "auto"].indexOf(value) > -1
    },
    list: {
      type: Array,
      default: () => [1, 2, 3, 4, 5]
    },
    /**
     * 显示条数，默认为4
     */
    showLength: {
      type: Number,
      default: 4
    }
  },
  computed: {
    isShow() {
      if (this.list.length < this.showLength + 1) {
        return false
      }
      return true
    },
    /* eslint-disable */
    leftTurn() {
      if (this.cardPosIndex == 0) {
        return { "no-turn": true }
      }
    },
    rightTurn() {
      if (
        this.list.length <= this.showLength ||
        Math.abs(this.cardPosIndex) + this.showLength === this.list.length
      ) {
        return { "no-turn": true }
      }
    },
    /* eslint-disable */
    show() {
      return this.list.length > 0
    }
  },
  data() {
    return {
      searchForm: {
        index: 0
      },
      cardPosIndex: 0,
      step: this.showLength,
      myList: []
    }
  },
  mounted() {},
  methods: {
    handleJumpClick(index, item) {},
    handleClick(index, item) {
      this.searchForm.index = index
      this.$emit("handle-click", item)
    },
    next() {
      if (this.type === "step") {
        this.cardPosIndex--
      } else {
        if (
          this.list.length - this.step - Math.abs(this.cardPosIndex) <
          this.step
        ) {
          this.cardPosIndex -=
            this.list.length - this.step - Math.abs(this.cardPosIndex)
        } else {
          this.cardPosIndex -= this.step
        }
      }
      this.searchForm.index = Math.abs(this.cardPosIndex)
      this.list.forEach((item, index) => {
        this.$refs.list[
          index
        ].style.transform = `translateX(${this.cardPosIndex}00%)`
      })
    },
    pre() {
      if (this.type === "step") {
        this.cardPosIndex++
      } else {
        if (Math.abs(this.cardPosIndex) % this.step) {
          this.cardPosIndex += Math.abs(this.cardPosIndex) % this.step
        } else {
          this.cardPosIndex += this.step
        }
      }
      this.searchForm.index = Math.abs(this.cardPosIndex)
      this.list.forEach((item, index) => {
        this.$refs.list[
          index
        ].style.transform = `translateX(${this.cardPosIndex}00%)`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin verticle-line() {
  &::after {
    position: absolute;
    top: 50%;
    right: 0;
    width: 2px;
    height: 65%;
    border: 1px;
    background: #eaeefa;
    content: "";
    transform: translateY(-50%);
  }
}

@mixin borderHide($hideColor: #fff) {
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
  height: 100%;
  background: $hideColor;
  content: "";
}

@mixin left($left: 0, $width: 32px) {
  position: absolute;
  z-index: 999;
  top: 50%;
  left: $left;
  display: flex;
  width: $width;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #f7faff;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}

@mixin right($right: 0, $width: 32px, $justify-content: center) {
  position: absolute;
  z-index: 999;
  top: 50%;
  right: $right;
  display: flex;
  width: $width;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #f7faff;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}

@property --houdini-colorA {
  inherits: false;
  initial-value: rgba(255, 235, 240, 0);
  syntax: "<color>";
}

@property --houdini-colorB {
  inherits: false;
  initial-value: rgba(255, 235, 240, 0.75);
  syntax: "<color>";
}

.container {
  position: relative;
  width: 100%;
  height: 50px;

  &-swiper-parent {
    position: absolute;
    left: 50%;
    display: flex;
    width: calc(100% - 64px);
    height: 100%;
    transform: translateX(-50%);

    &::after {
      @include borderHide(#f7faff);
    }

    .card {
      position: relative;
      display: flex;
      width: calc(25%);
      height: 100%;
      box-sizing: border-box;
      flex-grow: 1;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      background: linear-gradient(45deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))
          no-repeat,
        linear-gradient(
            to right,
            hsla(0, 0%, 100%, 0.3),
            hsla(0, 0%, 100%, 0.3)
          )
          no-repeat;
      background-color: transparent;
      background-image: linear-gradient(
        360deg,
        var(--houdini-colorA) 0%,
        var(--houdini-colorB) 100%
      );
      background-size: 100% 0%;
      font-size: 12px;
      transition: background-size 0.3s ease, transform 0.3s ease,
        --houdini-colora 0.3s, --houdini-colorb 0.3s;

      &:last-child::after {
        width: 0;
        content: "";
      }

      &:hover {
        background-size: 100% 100%;
        cursor: pointer;

        --houdini-colorA: #eff5ff;
        --houdini-colorB: #eff5ff;
        // background-color: #EFF5FF;
        // background-image:linear-gradient(#EFF5FF,#EFF5FF);
        // box-shadow: 1px 1px 2px rgba(204, 204, 204,.5);
        // filter: drop-shadow(5px 5px 5px rgba(204, 204, 204, 0.9)) saturate(110%);
        // font-size: 13px;
      }

      &:active {
        filter: drop-shadow(1px 20px 10px #ccc);
        transition: all 0.3s;
      }
    }

    .active {
      background-size: 100% 100%;
      transition: transform 0.3s ease, --houdini-colora 0.3s,
        --houdini-colorb 0.3s;

      --houdini-colorA: rgba(255, 235, 240, 0);
      --houdini-colorB: rgba(255, 235, 240, 0.75);
    }
  }

  .no-turn {
    pointer-events: none;

    .iconfont {
      color: #c6cfe1;
    }
  }

  &-left-parent {
    @include left();

    & > span {
      transition: color 0.3s;

      &:hover {
        color: #fd4378;
        cursor: pointer;
      }
    }
  }

  &-right-parent {
    @include right();

    & > span {
      transition: color 0.3s;

      &:hover {
        color: #fd4378;
        cursor: pointer;
      }
    }
  }
}
</style>
