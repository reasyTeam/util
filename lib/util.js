/**
 * 获取值的类型，返回对应的构造函数名
 * @param {any} obj
 */
export function getType (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

/**
 * 是否是Object
 */
export function isObject (obj) {
  return getType(obj) === 'Object'
}

/**
 * 是否是空对象
 */
export function isEmptyObject (obj) {
  let name
  for (name in obj) {
    return false
  }
  return true
};

/**
 * is not null or undefined
 */
export function isDefined (v) {
  return v !== undefined && v !== null
}

export function isUndef (v) {
  return v === undefined || v === null
}

/**
 * IP转化为整数
 */
export function ipToInt (ip) {
  var arr = ip.split('.')
  var num = +arr[3] + +arr[2] * (1 << 8) + +arr[1] * (1 << 16) + +arr[0] * (1 << 24)
  return num
}

/**
 * 检测是否在同一网段
 * @param  {String}  ipLan   [description]
 * @param  {String}  ipWan   [description]
 * @param  {String}  maskLan [description]
 * @param  {String}  maskWan [description]
 * @return {Boolean} [true在同一网段]
 */
export function isSameNet (ipLan, ipWan, maskLan, maskWan) {
  if ((ipLan === '') || (ipWan === '') || (maskLan === '') || (maskWan === '')) {
    return false
  }

  const ip1Arr = ipLan.split('.')
  const ip2Arr = ipWan.split('.')
  const maskArr1 = maskLan.split('.')
  const maskArr2 = maskWan ? maskWan.split('.') : maskArr1
  let maskArr = maskArr1
  let i

  for (i = 0; i < 4; i++) {
    if (maskArr1[i] !== maskArr2[i]) {
      if (maskArr1[i] & maskArr2[i] === maskArr1[i]) {
        maskArr = maskArr1
      } else {
        maskArr = maskArr2
      }
      break
    }
  }
  for (i = 0; i < 4; i++) {
    if ((ip1Arr[i] & maskArr[i]) !== (ip2Arr[i] & maskArr[i])) {
      return false
    }
  }
  return true
}

// clone
export function deepClone (obj, cache = new WeakMap()) {
  if (Object(obj) !== obj || typeof obj === 'function') {
    return obj
  }

  // 解决循环引用
  if (cache.get(obj)) {
    return cache.get(obj)
  }

  const type = getType(obj)
  if (type === 'Date') {
    return new Date(obj)
  } else if (type === 'RegExp') {
    return new RegExp(obj)
  }

  const clone = new obj.constructor()
  cache.set(obj, clone)

  const keys = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)]
  keys.forEach(key => {
    clone[key] = deepClone(obj[key])
  })
  return clone
}

/**
 * 防抖，回调函数只能被执行一次
 * @param {*} func 回调
 * @param {*} wait wait毫秒后执行
 * @param {*} immediate 设为true，只在开始的时候执行一次
 */
export function debounce (func, wait, immediate = false) {
  let timeout, context, args
  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 延迟函数执行完毕，清空定时器
    timeout = null
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

  const debounced = function (...params) {
    if (!timeout) {
      timeout = later()
      if (immediate) {
        // 立即执行
        func.apply(this, params)
      } else {
        // 闭包
        context = this
        args = params
      }
    } else {
      clearTimeout(timeout)
      timeout = later()
    }
  }
  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }
  return debounced
};

/**
 * 节流，一段时间内只能被执行一次
 * @param {*} func 
 * @param {*} wait 
 */
export function throttle (func, wait) {
  let timeout, context, args, result
  var previous = 0

  var later = function () {
    previous = Date.now() || new Date().getTime()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }

  const throttled = function () {
    var now = Date.now() || new Date().getTime()
    if (!previous) previous = now
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout) {
      // 判断是否设置了定时器
      timeout = setTimeout(later, remaining)
    }
    return result
  }

  throttled.cancel = function () {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }

  return throttled
};

const enCodeChar = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  ' ': '&nbsp;',
  '&': '&amp;',
  '\'': '&#39;'
}
const decodeChar = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': '\'',
  '&amp;': '&',
  '&nbsp;': ' '
}

/**
 * html文本特殊字符转码
 */
export function encodeText (str) {
  if (!str) {
    return str
  }

  str += ''
  return str.replace(/[<>"' &]/g, (c) => enCodeChar[c])
}

/**
 * html文本解码
 */
export function decodeText (str) {
  if (!str) {
    return str
  }

  str += ''
  return str.replace(/&(lt|gt|quot|#39|amp|nbsp);/g, (c) => decodeChar[c])
}

/**
 * guid
 */
export function guid () {
  const range = 12
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  let str = ''
  let pos = 0

  for (var i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1))
    if (i % 4 === 0) {
      str += '-'
    }
    str += arr[pos]
  }
  str += '-'
  return str
}
