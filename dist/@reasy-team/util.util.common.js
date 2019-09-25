/*!
 * @reasy-team/util v1.0.0 
 * (c) 2019 undefined
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 获取值的类型，返回对应的构造函数名
 * @param {any} obj
 */
function getType (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

/**
 * 是否是Object
 */
function isObject (obj) {
  return getType(obj) === 'Object'
}

/**
 * 是否是空对象
 */
function isEmptyObject (obj) {
  var name;
  for (name in obj) {
    return false
  }
  return true
}
/**
 * is not null or undefined
 */
function isDefined (v) {
  return v !== undefined && v !== null
}

function isUndef (v) {
  return v === undefined || v === null
}

/**
 * IP转化为整数
 */
function ipToInt (ip) {
  var arr = ip.split('.');
  var num = +arr[3] + +arr[2] * (1 << 8) + +arr[1] * (1 << 16) + +arr[0] * (1 << 24);
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
function isSameNet (ipLan, ipWan, maskLan, maskWan) {
  if ((ipLan === '') || (ipWan === '') || (maskLan === '') || (maskWan === '')) {
    return false
  }

  var ip1Arr = ipLan.split('.');
  var ip2Arr = ipWan.split('.');
  var maskArr1 = maskLan.split('.');
  var maskArr2 = maskWan ? maskWan.split('.') : maskArr1;
  var maskArr = maskArr1;
  var i;

  for (i = 0; i < 4; i++) {
    if (maskArr1[i] !== maskArr2[i]) {
      if (maskArr1[i] & maskArr2[i] === maskArr1[i]) {
        maskArr = maskArr1;
      } else {
        maskArr = maskArr2;
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
function deepClone (obj, cache) {
  if ( cache === void 0 ) cache = new WeakMap();

  if (Object(obj) !== obj || typeof obj === 'function') {
    return obj
  }

  // 解决循环引用
  if (cache.get(obj)) {
    return cache.get(obj)
  }

  var type = getType(obj);
  if (type === 'Date') {
    return new Date(obj)
  } else if (type === 'RegExp') {
    return new RegExp(obj)
  }

  var clone = new obj.constructor();
  cache.set(obj, clone);

  var keys = Object.getOwnPropertyNames(obj).concat( Object.getOwnPropertySymbols(obj));
  keys.forEach(function (key) {
    clone[key] = deepClone(obj[key]);
  });
  return clone
}

/**
 * 防抖，回调函数只能被执行一次
 * @param {*} func 回调
 * @param {*} wait wait毫秒后执行
 * @param {*} immediate 设为true，只在开始的时候执行一次
 */
function debounce (func, wait, immediate) {
  if ( immediate === void 0 ) immediate = false;

  var timeout, context, args;
  // 延迟执行函数
  var later = function () { return setTimeout(function () {
    // 延迟函数执行完毕，清空定时器
    timeout = null;
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args);
      context = args = null;
    }
  }, wait); };

  var debounced = function () {
    var params = [], len = arguments.length;
    while ( len-- ) params[ len ] = arguments[ len ];

    if (!timeout) {
      timeout = later();
      if (immediate) {
        // 立即执行
        func.apply(this, params);
      } else {
        // 闭包
        context = this;
        args = params;
      }
    } else {
      clearTimeout(timeout);
      timeout = later();
    }
  };
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced
}
/**
 * 节流，一段时间内只能被执行一次
 * @param {*} func 
 * @param {*} wait 
 */
function throttle (func, wait) {
  var timeout, context, args, result;
  var previous = 0;

  var later = function () {
    previous = Date.now() || new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) { context = args = null; }
  };

  var throttled = function () {
    var now = Date.now() || new Date().getTime();
    if (!previous) { previous = now; }
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) { context = args = null; }
    } else if (!timeout) {
      // 判断是否设置了定时器
      timeout = setTimeout(later, remaining);
    }
    return result
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled
}
var enCodeChar = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  ' ': '&nbsp;',
  '&': '&amp;',
  '\'': '&#39;'
};
var decodeChar = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': '\'',
  '&amp;': '&',
  '&nbsp;': ' '
};

/**
 * html文本特殊字符转码
 */
function encodeText (str) {
  if (!str) {
    return str
  }

  str += '';
  return str.replace(/[<>"' &]/g, function (c) { return enCodeChar[c]; })
}

/**
 * html文本解码
 */
function decodeText (str) {
  if (!str) {
    return str
  }

  str += '';
  return str.replace(/&(lt|gt|quot|#39|amp|nbsp);/g, function (c) { return decodeChar[c]; })
}

/**
 * guid
 */
function guid () {
  var range = 12;
  var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  var str = '';
  var pos = 0;

  for (var i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1));
    if (i % 4 === 0) {
      str += '-';
    }
    str += arr[pos];
  }
  str += '-';
  return str
}

exports.debounce = debounce;
exports.decodeText = decodeText;
exports.deepClone = deepClone;
exports.encodeText = encodeText;
exports.getType = getType;
exports.guid = guid;
exports.ipToInt = ipToInt;
exports.isDefined = isDefined;
exports.isEmptyObject = isEmptyObject;
exports.isObject = isObject;
exports.isSameNet = isSameNet;
exports.isUndef = isUndef;
exports.throttle = throttle;
