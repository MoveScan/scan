// 10位时间戳秒转换为标准时间 10位时间戳乘以1000
export function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}
// 13位时间戳毫秒不用乘以1000
export function timestampToTime_(timestamp) {
  var date = new Date(timestamp)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}
// 返回1天2时3分5秒
export function timestampToTimeLong(timestamp) {
  let startTime = timestampToTime_(timestamp)
  let endTime = getNowDate()
  return twoTimeInterval(startTime, endTime) + '前'
}

export function substring(str) {
  return str.substring(0, 8) + '...' + str.substring(str.length - 8)
}

/**
 * JS 计算两个时间间隔多久（时分秒）
 * @param startTime "2019-10-23 15:27:23"
 * @param endTime "2019-10-23 15:27:55"
 * @return 1天2时3分5秒
 */
export function twoTimeInterval(startTime, endTime) {
  // 开始时间
  let d1 = startTime.replace(/\-/g, '/')
  let date1 = new Date(d1)

  // 结束时间
  let d2 = endTime.replace(/\-/g, '/')
  let date2 = new Date(d2)

  // 时间相差秒数
  let dateDiff = date2.getTime() - date1.getTime()

  // 计算出相差天数
  let days = Math.floor(dateDiff / (24 * 3600 * 1000))

  // 计算出小时数
  let residue1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  let hours = Math.floor(residue1 / (3600 * 1000))

  // 计算相差分钟数
  let residue2 = residue1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  let minutes = Math.floor(residue2 / (60 * 1000))

  // 计算相差秒数
  let residue3 = residue2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  let seconds = Math.round(residue3 / 1000)

  let returnVal = (days == 0 ? '' : days + '天') + (hours == 0 ? '' : days + '时') + (minutes == 0 ? '' : minutes + '分') + (seconds == 0 ? '' : seconds + '秒')
  return returnVal
}

// 格式化日对象
export function getNowDate() {
  var date = new Date()
  var year = date.getFullYear() // 年
  var month: any = date.getMonth() + 1 // 月
  var day: any = date.getDate() // 日
  var hour: any = date.getHours() // 时
  var minutes: any = date.getMinutes() // 分
  var seconds: any = date.getSeconds() //秒
  var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
  var week = weekArr[date.getDay()]
  // 给一位数的数据前面加 “0”
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (day >= 0 && day <= 9) {
    day = '0' + day
  }
  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = '0' + minutes
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = '0' + seconds
  }
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
}
