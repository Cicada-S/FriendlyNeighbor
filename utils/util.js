// 将时间戳转换具体时间
const toDates = (times, type) => {
  const date = new Date(times)
  const Y = date.getFullYear()
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  const H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const Min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let dateTime = ''
  if(type === 'display') {
    dateTime = M + '月' + D + ' ' + H + ':' + Min
  } else {
    dateTime = Y + '-' + M + '-' + D + ' ' + H + ':' + Min
  }
  return dateTime
}

module.exports = {
  toDates
}
