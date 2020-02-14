const chunks = (arr, size = 2) => {
  return arr.map((x, i) => i % size == 0 && arr.slice(i, i + size)).filter(x => x)
}

export { chunks }