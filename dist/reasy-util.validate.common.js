/*!
 * reasy-util v1.0.0 
 * (c) 2019 undefined
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
exports.domain = domain;
exports.email = email;
exports.even = even;
exports.float = float;
exports.getUtf8Length = getUtf8Length;
exports.hex = hex;
exports.ip = ip;
exports.ipNet = ipNet;
exports.ipSpecific = ipSpecific;
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
exports.url = url;
