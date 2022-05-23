export const data = Array.from({ length: 52 }, (_, k) => ({
  date: "11.2" + k,
  targetValue: +((k + 1) * (Math.random() + 12112)).toFixed(2),
  realValue: +((k + 2) * (Math.random() + 21111)).toFixed(2),
  lineValue: +((((k + 2) * (Math.random() + 211)) % 100) / 100).toFixed(2)
}))
