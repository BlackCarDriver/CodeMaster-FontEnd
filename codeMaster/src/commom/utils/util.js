import moment from 'moment'
import { message } from 'antd'
// import { exportExcel } from 'xlsx-oc'

// ******************* Style ***************************

// 表格默认显示行数以及翻页按钮风格
export const tableStyle = {
  defaultPageSize: 50,
  pageSizeOptions: ['50', '100', '500', '2000'],
  showSizeChanger: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
}

// input输入框自适应格式
export const Inputlayout = {
  labelCol: {
    sm: { span: 24, align: 'left' },
    md: { span: 6, align: 'right' },
    lg: { span: 4, align: 'right' },
    xl: { span: 3, align: 'right' },
    xxl: { span: 2, align: 'right' }
  },
  wrapperCol: {
    sm: { span: 24, align: 'left' },
    md: { span: 18, align: 'left' },
    lg: { span: 8, align: 'left' },
    xl: { span: 6, align: 'left' },
    xxl: { span: 5, align: 'left' }
  }
}

// ******************** Formater ********************

// 格式化时间间隔
// 支持传入10位或13位毫秒数，如 1587367194536,"1587367194"
// 支持传入日期格式，如 "2020/4/20 15:31:18"
function getTimeDistance (time) {
  if (typeof time == 'number' || Number(time) == time) {
    if (String(time).length == 10) {
      time = Number(time) * 1000
    } else if (String(time).length == 13) {
      time = Number(time)
    } else {
      console.log('时间格式错误')
      return time
    }
  } else {
    if (typeof time == 'string' && time.split(' ').length == 2 && time.split(/[- : /]/).length == 6) {
      time = new Date(time.replace(/-/g, '/')).getTime()
    } else {
      console.log('时间格式错误')
      return time
    }
  }
  // 处理之后的time为13位数字格式的毫秒数
  let dateNow = new Date()
  let dateTime = new Date(time)
  let distance = dateNow.getTime() - time

  var days = parseInt(distance / (1000 * 60 * 60 * 24))
  if (days == 1) {
    return '昨天'
  } else if (days > 1 && days < 4) {
    return days + '天前'
  } else if (days > 3) {
    // 超过3天的，返回日期，如 2018-12-05
    // 如果是今年的，就省去年份，返回 12-05
    let year = dateTime.getFullYear()
    let month = dateTime.getMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    let day = dateTime.getDate()
    if (day < 10) {
      day = '0' + day
    }
    if (dateNow.getFullYear() == year) {
      return month + '-' + day
    } else {
      return year + '-' + month + '-' + day
    }
  }

  let hours = parseInt(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
  if (hours > 0) {
    return hours + '小时前'
  }

  let minutes = parseInt(distance % (1000 * 60 * 60) / (1000 * 60))

  if (minutes > 0) {
    return minutes + '分钟前'
  }
  return '刚刚'
}

// 格式化时间, 单位为秒
export function timeFormater (time, style = 0) {
  if (typeof time !== 'number') {
    console.warn('timeFormater get unexpect type params: ', time)
    return ''
  }
  switch (style) {
  case 0:
    return moment(time * 1000).format('YYYY-MM-DD HH:mm')
  case 1:
    return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
  case 2:
    return moment(time * 1000).format('YYYY年MM月DD日')
  case 3:
    return moment(time * 1000).format('YYYY年MM月DD日HH点')
  case 4:
    return moment(time * 1000).format('YYYY年MM月DD日HH:mm:ss')
  case 5:
    return moment(time * 1000).format('HH:mm:ss')
  case 6:
    return getTimeDistance(time * 1000)
  case 7:
    return moment(time * 1000).format('MM-DD:HH')
  }
  console.error('timeformater get invalid style: ', style)
  return '?' + time
}

// 格式化文件大小
export function sizeFormater (size) {
  const unit = ['B', 'KB', 'MB', 'GB', 'TB']
  let ptr = 0
  let oldSize = size
  while(size > 1024 && ptr < unit.length) {
    size /= 1024
    ptr ++
  }
  if (ptr < unit.length) {
    return Math.ceil(size) + unit[ptr]
  }
  return '?' + oldSize
}

// ******************** Tool function ***************
// 导出表格
// ignore: 需要忽略导出的title
/*
export function exportTable (columns, arrayData, ignore = []) {
  if (arrayData.length === 0) {
    return
  }
  if (!Array.isArray(ignore)) {
    message.warn('导出表格用法错误,请检查控制台')
    console.error('Error: fail to export exel, ignoreList=', ignore)
    return
  }
  let exportHeader = []
  for (let i = 0; i < columns.length; i++) {
    let col = columns[i]
    if (ignore.length > 0 && ignore.includes(col.title)) {
      continue
    }
    if (col.export === undefined || col.export) {
      exportHeader.push({ k: col.dataIndex, v: col.title })
    }
  }
  exportExcel(exportHeader, arrayData)
}
*/

// 重复调用一个函数，直至返回true或超过指定次数
export function trySeveralTimes (callback, delay, times) {
  if (typeof callback !== 'function') {
    message.error('发生错误，请查看控制台')
    console.error('tryServalTimes() unexpect params: callback=' + callback)
    return
  }
  if (typeof delay !== 'number' || delay <= 0) {
    message.error('发生错误，请查看控制台')
    console.error('tryServalTimes() unexpect params: delay=' + delay)
    return
  }
  if (typeof times !== 'number' || times <= 0) {
    message.error('发生错误，请查看控制台')
    console.error('tryServalTimes() unexpect params: times=' + times)
    return
  }
  if (times <= 0) {
    message.error('发生错误，请查看控制台')
    console.error('tryServalTimes fail after', times, 'times, callback=', callback)
    return
  }
  const result = callback()
  if (result !== true && result !== false) {
    message.error('发生错误，请查看控制台')
    console.error('tryServalTimes() unexpect callback, not return boolean value')
  }
  if (result) {
    return
  }
  setTimeout(() => {
    trySeveralTimes(callback, delay, times - 1)
  }, delay)
}

// 查询url参数
export function getQueryVariable (variable) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return decodeURIComponent(pair[1])
    }
  }
  return ''
}

// 复制content到粘贴板
export function copyToClip (content) {
  var aux = document.createElement('input')
  aux.setAttribute('value', content)
  document.body.appendChild(aux)
  aux.select()
  document.execCommand('copy')
  document.body.removeChild(aux)
  message.info('复制成功')
}
