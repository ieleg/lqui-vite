import "../src/index.css"
export const decorators = [
  args => ({
    beforeCreate: function () {},
    template: "<story />"
  })
]
export const parameters = {
  layout: "centered",
  controls: { expanded: true },
  docs: {
    inlineStories: true
  }
}