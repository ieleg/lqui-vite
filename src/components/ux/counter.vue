<template>
  <ul
    role="list"
    class="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500"
  >
    <li>cups chopped Porcini mushrooms</li>
    <li>cup of olive oil</li>
    <li>of celery</li>
  </ul>
</template>
<style lang="scss" scoped>
ul {
    counter-reset: section;
}
li {
    counter-increment: section;
    &::before {
        content: counter(section) '、'
    }
}
</style>