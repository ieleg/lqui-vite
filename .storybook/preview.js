import "../src/index.css"
import { createPinia } from 'pinia'
import { app } from '@storybook/vue3'
const pinia = createPinia()
app.use(pinia)
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