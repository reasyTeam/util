/*!
 * reasy-util v1.0.0 
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

function getUtf8Length (str) {
  var len = str.length;
  var totalLength = 0;
  var charCode;
  var i;

  for (i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode < 0x007f) {
      totalLength++;
    } else if ((charCode >= 0x0080) && (charCode <= 0x07ff)) {
      totalLength += 2;
    } else if ((charCode >= 0x0800) && (charCode <= 0xffff)) {
      totalLength += 3;
    } else {
      totalLength += 4;
    }
  }
  return totalLength
}

function len (str, min, max) {
  var len = str.length;

  if (typeof min !== 'undefined' && typeof max !== 'undefined' && (len < min || len > max)) {
    return _('Range: %s to %s characters', [min, max])
  }
}

function byteLen (str, min, max) {
  var totalLength = getUtf8Length(str);

  if (typeof min !== 'undefined' && typeof max !== 'undefined' && (totalLength < min || totalLength > max)) {
    return _('Range: %s to %s bytes', [min, max])
  }
}

function num (str, min, max) {
  if (min !== 'undefined' && min < 0) {
    if (!(/(^-[0-9]{1,}$)|(^[0-9]{1,}$)/).test(str)) {
      return _('Enter digits')
    }
  } else {
    if (!(/(^-[0-9]{1,}$)|(^[0-9]{1,}$)/).test(str)) {
      return _('Enter digits')
    }
  }
  if (typeof min !== 'undefined' && typeof max !== 'undefined') {
    if (parseInt(str, 10) < min || parseInt(str, 10) > max) {
      return _('Range: %s to %s', [min, max])
    }
  }
}

function float (str, min, max) {
  var floatNum = Number(str);

  if (isNaN(floatNum)) {
    return _('Must be float')
  }
  if (typeof min !== 'undefined' && typeof max !== 'undefined') {
    if (floatNum < min || floatNum > max) {
      return _('Range: %s to %s', [min, max])
    }
  }
}

function even (str, min, max) {
  var isError = num(str, min, max);
  if (isError) {
    return isError
  }
  if (str % 2 !== 0) {
    return _('Must be even')
  }
}

/**
 * 不包含协议部分url验证
 * @param {*} str 
 */
function url (str) {
  if (this.byteLen(str, 1, 64)) {
    return this.byteLen(str, 1, 64)
  }
  if (/^[-_~|#?&\\/.%0-9a-z\u4e00-\u9fa5]+$/ig.test(str)) {
    if (!(/.+\..+/ig.test(str) || str === 'localhost')) {
      return _('Invalid URL')
    }
  } else {
    return _('Invalid URL')
  }
}

function phoneNumber (str, len) {
  var ret = str;
  len = len || 31;
  // 不能为空
  if (ret === '') {
    return _('Enter a valid phone number')
  }

  // 可能有+号，且只能在最前面
  if (ret.indexOf('+') !== -1) {
    if (ret.indexOf('+') !== 0) {
      return _('Enter a valid phone number')
    } else {
      ret = '0' + ret.slice(1);
    }
  }

  // 只能是数字
  if (!(/^[0-9]{1,}$/).test(ret)) {
    return _('Enter a valid phone number')
  }

  // 最长为31位
  if (byteLen(ret, 1, len)) {
    return _('Enter a valid phone number')
  }
}

function domain (str, min, max) {
  if (typeof min !== 'undefined' && typeof max !== 'undefined' && min <= max) {
    var totalLength = getUtf8Length(str);

    if (totalLength < min || totalLength > max) {
      return _('Range: %s to %s bytes', [min, max])
    }
  }

  if (!/^[\d.]+$/.test(str)) {
    if (/^([\w-]+\.)*(\w)+$/.test(str)) {
      return
    }
  } else {
    if (!ip(str)) {
      return
    }
  }
  return _('Enter a valid IP address or domain name.')
}

function mac (str) {
  var subMac = str.split(':')[0];
  if (subMac.charAt(1) && parseInt(subMac.charAt(1), 16) % 2 !== 0) {
    return _('The second character of a MAC address must be an even number.')
  }

  if (str === '00:00:00:00:00:00') {
    return _('The MAC address cannot be 00:00:00:00:00:00.')
  }

  if (!(/^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/).test(str) && !(/^([0-9a-fA-F]{2}-){5}[0-9a-fA-F]{2}$/).test(str)) {
    return _('MAC address format: XX:XX:XX:XX:XX:XX')
  }
}

function specialMac (str) {
  if (!(/^([0-9a-fA-F]{4}-){2}[0-9a-fA-F]{4}$/).test(str)) {
    return _('Please enter a valid MAC address')
  }
}

function ipSpecific (str) {
  var ipArr = str.split('.');

  if (ipArr[0] === '127') {
    return _('Valid range: 1 to 223, excluding 127')
  }
  if (ipArr[0] > 223) {
    return _('Valid range: 1 to 223, excluding %s', [ipArr[0]])
  }
}

function ip (str) {
  var ret = ipSpecific(str);

  if (ret) {
    return ret
  }

  if (!(/^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-4])$/).test(str)) {
    return _('Please enter a valid IP address.')
  }
}

function ipNet (str) {
  var ret = ipSpecific(str);

  if (ret) {
    return ret
  }

  if (!(/^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/).test(str)) {
    return _('Enter a valid network segment or IP address')
  }
}

function privateIP (str) {
  var reg = /^((10\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d))|(172\.(1[6-9]|2\d|3[0-1]))|(192\.168))\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.(25[0-4]|2[0-4]\d|1\d\d|[1-9]\d|[1-9])$/;
  if (!reg.test(str)) {
    return _('Enter a valid private IP address')
  }
}

/**
 * 判断输入IP地址与lanIP是否在同一个网段，默认输入的是合法的IP地址
 */
function netSegmentCheck (inputIP, lanIP, mask) {
  var res1 = [];
  var res2 = [];
  if (lanIP === inputIP) {
    return _('It cannot be the same as the LAN IP address')
  }
  inputIP = inputIP.split('.');
  lanIP = lanIP.split('.');
  mask = mask.split('.');

  for (var i = 0, len = inputIP.length; i < len; i += 1) {
    res1.push(parseInt(inputIP[i]) & parseInt(mask[i]));
    res2.push(parseInt(lanIP[i]) & parseInt(mask[i]));
  }
  if ((res1.length !== 4) || (res2.length !== 4)) ; else if (res1.join('.') !== res2.join('.')) {
    return _('It must belong to the same network segment as that of the LAN IP address')
  }
}

function mask (str) {
  var rel = /^(254|252|248|240|224|192|128)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/;
  if (!rel.test(str)) {
    return _('Enter a valid subnet mask')
  }
}

// 可以输入全255.255.255.255
function allMask (str) {
  var rel = /^(254|252|248|240|224|192|128)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(255|254|252|248|240|224|192|128|0))$/;
  if (!rel.test(str)) {
    return _('Enter a valid subnet mask')
  }
}

function email (str) {
  var rel = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  if (!rel.test(str)) {
    return _('Enter a valid Email address')
  }
}

function hex (str) {
  if (!(/^[0-9a-fA-F]{1,}$/).test(str)) {
    return _('Only hexadecimal characters are allowed.')
  }
}

/**
 * 检测是否包含全角字符
 * @param  {[type]} str [待检测字符串]
 * @return {[type]}     [true：包含全角字符 false:不包含]
 */
function chkHalf (str) {
  for (var i = 0; i < str.length; i++) {
    var strCode = str.charCodeAt(i);
    if ((strCode > 65248) || (strCode === 12288)) {
      return _('Full-width characters are not allowed.')
    }
  }
}

function ascii (str, min, max) {
  var error = chkHalf(str);
  if (error) {
    return error
  }

  if (!(/^[ -~]+$/g).test(str)) {
    return _('Please enter non-Chinese characters.')
  }
  if (min || max) {
    return byteLen(str, min, max)
  }
}

function noSpaceStartEnd (str) {
  if ((/^\s|\s$/).test(str)) {
    return _('The first and last characters of the SSID cannot be spaces.')
  }
}

function lanMask (str) {
  var reg = /^(254|252|248|240|224|192|128)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(252|248|240|224|192|128|0))$/;

  if (!reg.test(str)) {
    return _('Enter a valid subnet mask')
  }
}
// 不允许有空格
function noSpace (str) {
  if (/\s/.test(str)) {
    return _('Spaces are disallowed')
  }
}

exports.allMask = allMask;
exports.ascii = ascii;
exports.byteLen = byteLen;
exports.chkHalf = chkHalf;
exports.debounce = debounce;
exports.decodeText = decodeText;
exports.deepClone = deepClone;
exports.domain = domain;
exports.email = email;
exports.encodeText = encodeText;
exports.even = even;
exports.float = float;
exports.getType = getType;
exports.getUtf8Length = getUtf8Length;
exports.guid = guid;
exports.hex = hex;
exports.ip = ip;
exports.ipNet = ipNet;
exports.ipSpecific = ipSpecific;
exports.ipToInt = ipToInt;
exports.isDefined = isDefined;
exports.isEmptyObject = isEmptyObject;
exports.isObject = isObject;
exports.isSameNet = isSameNet;
exports.isUndef = isUndef;
exports.lanMask = lanMask;
exports.len = len;
exports.mac = mac;
exports.mask = mask;
exports.netSegmentCheck = netSegmentCheck;
exports.noSpace = noSpace;
exports.noSpaceStartEnd = noSpaceStartEnd;
exports.num = num;
exports.phoneNumber = phoneNumber;
exports.privateIP = privateIP;
exports.specialMac = specialMac;
exports.throttle = throttle;
exports.url = url;
