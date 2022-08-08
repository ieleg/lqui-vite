export function brightenKeyword(val, keyword, color = "#7369CC") {
    if (!keyword) return val
    if (keyword.includes(',')) {
      const keywordArr = keyword.split(',')
      let str = val
      for (const word of keywordArr) {
        if (word) {
          const regWord = word.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&') // 先转义正则的特殊工字符
          const RegStr = new RegExp(regWord, 'g')
          str = str.replace(
            RegStr,
            `<span style="color: ${color}">${word}</span>`
          )
        }
      }
      return str
    } else {
      // const regKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') // 先转义正则的特殊工字符
      const regKeyword = keyword.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&') // 先转义正则的特殊工字符
      const Reg = new RegExp(regKeyword, 'g')
      if (val) {
        return val.replace(
          Reg,
          `<span style="color: ${color}">${keyword}</span>`
        )
      }
    }
  }