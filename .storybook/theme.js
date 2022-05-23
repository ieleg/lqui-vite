import { create } from "@storybook/theming/create"
import logo from "../.readme-assets/wl-logo3.png"

export default create({
  name: "Theme",
  base: "light",
  colorPrimary: "hotpink",
  colorSecondary: "deepskyblue",
  textColor: "black",
  textInverseColor: "rgba(255,255,255,0.9)",
  brandTitle: "LQUI",
  brandImage: logo
})
