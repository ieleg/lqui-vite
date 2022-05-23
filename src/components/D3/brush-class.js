/**
 * 由两部分组成，一个是主图bar，一个辅图brush，辅图拖动选中区域可改变主图展示范围
 * margin区域:
 */

const BarBrush = class {
  constructor(
    data,
    {
      id,
      width = 400,
      height = 400,
      margin = [0, 10, 40, 28], // 画布margin 上右下左
      miniMargin = [0, 40, 0, 28] // 画布margin 上右下左
    }
  ) {
    this.mainXcale = undefined
  }
  brushMove() {}
}
