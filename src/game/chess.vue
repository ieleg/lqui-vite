<template>
  <div class="grid grid-cols-3 grid-rows-3 w-80 aspect-square gap-1 bg-main-2">
    <div
      v-for="(item, index) in chess"
      :key="index"
      class="
        h-full
        border-spacing-4
        bg-main-5
        aspect-square
        cursor-pointer
        flex
        items-center
        justify-center
      "
      :class="{
        line: ~indexLine.indexOf(index)
      }"
      @click="handleClick(index)"
    >
      <svg
        fill="none"
        viewBox="0 0 40 40"
        stroke="currentColor"
        id="x"
        class="w-10 h-10"
        v-if="item"
      >
        <path
          v-if="item === 'us'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 6 L34 34 M30 6 L6 34"
        ></path>
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318 a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        ></path>
      </svg>
    </div>
  </div>
  <div class="fixed inset-0 w-full" role="dialog" v-if="isOver || winner">
    <div
      class="
        relative
        max-w-2xl
        m-auto
        mt-4
        bg-white
        p-5
        w-full
        backdrop:bg-font-2
        shadow-[0_0_0_50vmax_rgba(0,0,0,.4)]
        rounded-xl
        z-50
      "
    >
      游戏结束，{{ winner ? winner + "获胜" : "平局" }}
      <button @click="reset" class="cursor-pointer ring-1 p-2 ml-5">
        重置游戏
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useChess } from "./useChess"
const { chess, handleClick, reset, winner, isOver, indexLine } = useChess()
</script>

<style lang="scss" scoped>
.line {
  @apply bg-main-3;
}
</style>
