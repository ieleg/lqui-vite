export const data = Array.from({ length: 50 }, (_, k) => ({
  key: k,
  value: Math.random() * (k + 1 * 5) + 50
}))
