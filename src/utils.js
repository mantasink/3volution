export function rnd(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function collision(p1x, p1y, r1, p2x, p2y, r2) {
  var a
  var x
  var y

  a = r1 + r2
  x = p1x - p2x
  y = p1y - p2y

  return a > Math.sqrt((x * x) + (y * y))
}

export function average(array, field) {
  let values = array.map(v => v[field])
  let count = values.length
  values = values.reduce((previous, current) => current += previous)
  return Math.round(values /= count)
}

export function getVal(input) {
  return document.getElementById(input).value
}