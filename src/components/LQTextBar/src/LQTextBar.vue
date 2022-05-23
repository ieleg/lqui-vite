<template>
  <div v-if="text.length" class="lq-text-bar">
    <div
      v-for="(info, index) in text"
      :key="index"
      class="lq-text-bar-box"
      :title="info"
    >
      {{ info }}
      <i />
    </div>
  </div>
</template>

<script>
export default {
  name: "LqTextBar",
  props: {
    text: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},

  methods: {}
}
</script>

<style lang="scss">
.lq-text-bar {
  padding: 1em;
  background: rgb(138, 58, 73);
  border-radius: 8px;
  color: #fff;

  &-box {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    line-height: 1.5em;
    text-overflow: -o-ellipsis-lastline;
    text-overflow: ellipsis;
  }
}
</style>
