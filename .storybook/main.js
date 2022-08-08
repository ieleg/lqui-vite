const { mergeConfig } = require("vite");
module.exports = {
  stories: ["../stories/**/**/*.stories.@(ts|js|mdx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-storysource",
    "@storybook/preset-scss",
    "@storybook/addon-toolbars",
    '@storybook/addon-postcss'
  ],
  framework: "@storybook/vue3",
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(config, { configType }) {
    if (configType === "DEVELOPMENT") {
      // Your development configuration goes here
    }
    if (configType === "PRODUCTION") {
      // Your production configuration goes here.
    }
    return mergeConfig(config, {
      base: './'
      // Your environment configuration here
    });
  },
};
