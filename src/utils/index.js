// import request from '@/utils/request'

// const REQUEST_API = {
//   GetPageList: '/api/Video/GetPageList', // 请求数据列表
//   DeleteVideos: '/api/Video/DeleteVideos'
// }

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} url
 * @returns {Object}
 * {
 *  type: VEDIO
 *  fun: GetPageList
 * }
 */
export function getList(obj, api, params) {
  api(params).then(response => {
    if (response.statusCode === 200) {
      obj.loading = false
      obj.tableData = response.data.pageList
      obj.total = response.data.totalRowCount
    }
  })
}

export function export2Excel(tData, tTitle, tName) {
  require.ensure([], () => {
    const { export_json_to_excel } = require('@/excel/export2Excel') // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
    const tHeader = [] // 导出的excel的表头字段名称
    const filterVal = [] // 对象属性，对应于tHeader
    tTitle.forEach((item) => {
      tHeader.push(item.label)
      filterVal.push(item.value)
    })
    const list = tData // json数组对象，接口返回的数据
    const data = formatJson(filterVal, list)
    export_json_to_excel(tHeader, data, tName)// 导出的表格名称
  })
}

export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

export function timeThree() {
  // 当天
  let thatDay = ''
  // 当月第一天
  let oneDayTime = ''
  // 当月最后一天
  let zDay = ''
  let date = new Date();
  let curr_date = date.getDate();
  let curr_month = date.getMonth() + 1;
  let curr_year = date.getFullYear();
  String(curr_month).length < 2 ? (curr_month = "0" + curr_month) : curr_month;
  String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
  thatDay = curr_year + "-" + curr_month + "-" + curr_date;

  String(curr_year).length < 2 ? (curr_year = "0" + curr_year) : curr_year;
  var m = date.getMonth() + 1;
  String(m).length < 2
    ? (m = "0" + m)
    : m;
  var d = '01';
  oneDayTime = curr_year + "-" + m + "-" + d;
//结束时间
  var currentMonth=date.getMonth();
  var nextMonth=++currentMonth;
  var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
  var oneDay=1000*60*60*24;
  var date1 = new Date(nextMonthFirstDay-oneDay);
  var yy = date1.getFullYear();
  String(yy).length < 2
    ? (yy = "0" + yy)
    : yy;
  var mm = date1.getMonth() + 1;
  String(mm).length < 2
    ? (mm = "0" + mm)
    : mm
  var dd = date1.getDate();
  String(dd).length < 2
    ? (dd = "0" + dd)
    : dd;
   zDay = yy + "-" + mm + "-" + dd;
  return [thatDay,oneDayTime,zDay]
}

