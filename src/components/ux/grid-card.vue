<template>
  <div class="wrapper lg:grid-cols-4">
    <div class="grid-card lg:col-span-2 bg-font-3">
      You can also use variant modifiers to target media queries like responsive
      breakpoints, dark mode, prefers-reduced-motion, and more. For example, use
      md:grid-cols-6 to apply the grid-cols-6 utility at only medium screen
      sizes and above
    </div>
    <div class="grid-card">
      ault, Tailwind includes grid-template-column utilities for creating basic
      your
    </div>
    <div class="grid-card lg:row-span-2 bg-main-4 break-words   ">
      ault, Tailwind includes grid-template-column utilities for creating
      basicgrids with up to 12 equal width columns. You can customize these
      values byediting theme.gridTemplateColumns or
      theme.extend.gridTemplateColumns inyour
    </div>
    <div class="grid-card break-words">
      editing theme.gridTemplateColumns or theme.extend.gridTemplateColumns in
    </div>
    <div class="grid-card lg:col-span-2 bg-font-4">
      editing theme.gridTemplateColumns or theme.extend.gridTemplateColumns in
    </div>
  </div>
</template>

<style lang="scss">
.wrapper {
  display: grid;
  gap: 1rem;
}
.grid-card {
  padding: 1rem;
}
</style>
