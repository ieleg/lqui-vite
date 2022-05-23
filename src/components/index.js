import LqUpload from "./LqUpload"
import LqProgress from "./LQProgress"
import LqTextBar from "./LQTextBar"
import { version } from "../../package.json"

const components = [LqTextBar, LqProgress, LqUpload]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}
/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue)
}

const LqUi = {
  version,
  install
}

export default LqUi
export { LqTextBar, LqProgress, LqUpload }
