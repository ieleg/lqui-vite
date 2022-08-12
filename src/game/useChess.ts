/**
 *
 *
 *
 *
 *
 *
 */

import { ref, computed } from "vue"

/* 
    假设用户先下， ai在用户下的区域之外随机落子
    如果出现三个连起来或者填满区域就结束游戏
    [
      ai ai us
      us ai ai
      ai us us   
    ]
    [ai, ai, us, us, ai, ai, ai, us, us]
    0 1 2, 3 4 5, 6 7 8
    0 3 6, 1 4 7, 2 5 8
    0 4 8, 2 4 6
*/
export const useChess = () => {
  const windIndex = [
    "0,1,2",
    "3,4,5",
    "6,7,8",
    "0,3,6",
    "1,4,7",
    "2,5,8",
    "0,4,8",
    "2,4,6"
  ]
  const chess = ref(new Array(9).fill(""))
  const isOver = computed(() => chess.value.every(d => d))
  const winner = ref("")
  const indexLine = ref<[number, number, number]>([-1, -1, -1])
  const userTurn = index => {
    chess.value[index] = "us"
  }

  const aiTurn = () => {
    const restIndexArr = chess.value
      .map((d, index) => (d ? -1 : index))
      .filter(d => ~d)
    const index = restIndexArr.sort(() => Math.random() - 0.5).slice(0, 1)[0]
    chess.value[index] = "ai"
  }

  const checkWinner = () => {
    windIndex.some(str => {
      const [index1, index2, index3] = str.split(",")
      const equal = chess.value[index1] &&
        chess.value[index1] === chess.value[index2] &&
        chess.value[index1] === chess.value[index3]
      if (equal) {
        winner.value = chess.value[index1]
        console.log(chess.value);
        
        indexLine.value = [+index1, +index2, +index3]
      }
      return equal
    })
    if (winner.value) {
    }
  }

  const handleClick = index => {
    if (chess.value[index]) {
      return
    }
    userTurn(index)
    if (!isOver.value) {
      aiTurn()
    }
    checkWinner()
  }

  const reset = () => {
    chess.value = new Array(9).fill("")
    indexLine.value = [-1, -1, -1]
    winner.value = ""
  }
  return {
    indexLine,
    chess,
    winner,
    isOver,
    reset,
    handleClick
  }
}
