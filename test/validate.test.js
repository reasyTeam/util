import * as validate from '../lib/validate'

global._ = function (val) {
  return val;
}

describe('validate test', () => {
  describe('getUtf8Length', () => {
    test('12345', () => {
      expect(validate.getUtf8Length('12345')).toBe(5)
    })
    test('12ABC', () => {
      expect(validate.getUtf8Length('12ABC')).toBe(5)
    })
    test('中文测试', () => {
      expect(validate.getUtf8Length('中文测试')).toBe(12)
    })
  })

  describe('len', () => {
    test('12345', () => {
      expect(validate.len('12345')).toBeUndefined()
    })
    test('12ABC', () => {
      expect(validate.len('12ABC', 6, 7)).not.toBeUndefined()
    })
    test('contain chinese', () => {
      expect(validate.len('中文7个字符', 5, 7)).toBeUndefined()
    })
  })

  describe('byteLen', () => {
    test('12345', () => {
      expect(validate.byteLen('12345', 5, 10)).toBeUndefined()
    })
    test('12ABC', () => {
      expect(validate.byteLen('12ABC', 6, 10)).not.toBeUndefined()
    })
    test('range test with chinese', () => {
      expect(validate.byteLen('中文好几个字节', 6, 12)).not.toBeUndefined()
    })
  })

  describe('num', () => {
    test('123', () => {
      expect(validate.num(123)).toBeUndefined()
    })
    test('-123', () => {
      expect(validate.num('-123')).toBeUndefined()
    })
    test('-123 rang -100-100', () => {
      expect(validate.num('-123', -100, 100)).not.toBeUndefined()
    })
    test('123.3', () => {
      expect(validate.num('123.3')).not.toBeUndefined()
    })
  })

  describe('float', () => {
    test('-1233.3', () => {
      expect(validate.float('-1233.3')).toBeUndefined()
    })
    test('123.3.3', () => {
      expect(validate.float('123.3.3')).not.toBeUndefined()
    })
  })

  describe('even', () => {
    test('1', () => {
      expect(validate.even(1)).not.toBeUndefined()
    })
    test('0', () => {
      expect(validate.even('0')).toBeUndefined()
    })
    test('0er', () => {
      expect(validate.even('0er')).not.toBeUndefined()
    })
    test('1000', () => {
      expect(validate.even('1000')).toBeUndefined()
    })
  })

  describe('url', () => {
    test('url', () => {
      expect(validate.url('192.168.99.17/')).toBeUndefined()
      expect(validate.url('localhost')).toBeUndefined()
    })
    test('illegal url', () => {
      expect(validate.url('www.taobao.com/localhost/localhost/localhost/localhostlocal/hostlocalhost/localhost/localhost')).not.toBeUndefined()
      expect(validate.url('localhost1')).not.toBeUndefined()
      expect(validate.url('http://192.168.99.17/')).not.toBeUndefined()
    })
  })

  describe('phoneNumber', () => {
    test('phoneNumber', () => {
      expect(validate.phoneNumber('+8613361788736')).toBeUndefined()
      expect(validate.phoneNumber('+86133617836')).toBeUndefined()
      expect(validate.phoneNumber('8008208820')).toBeUndefined()
    })
    test('illegal phoneNumber', () => {
      expect(validate.phoneNumber('1336171246U')).not.toBeUndefined()
      expect(validate.phoneNumber('25874136978965567567567657567641235825652558256')).not.toBeUndefined()
    })
  })

  describe('domain', () => {
    test('domain', () => {
      expect(validate.domain('_.123')).toBeUndefined()
      expect(validate.domain('154565_asdzd')).toBeUndefined()
      expect(validate.domain('192.168.3.6')).toBeUndefined()
      expect(validate.domain('www.baidu.com', 9, 8)).toBeUndefined()
    })
    test('illegal domain', () => {
      expect(validate.domain('19213.134.134')).not.toBeUndefined()
      expect(validate.domain('www.baidu.com.')).not.toBeUndefined()
      expect(validate.domain('www.baidu.com', 2, 8)).not.toBeUndefined()
    })
  })

  describe('mac', () => {
    describe('illegal mac', () => {
      test('00:00:00:00:00:00', () => {
        expect(validate.mac('00:00:00:00:00:00')).not.toBeUndefined()
      })
      test('01:00:00:00:00:00', () => {
        expect(validate.mac('01:00:00:00:00:00')).not.toBeUndefined()
      })
      test('00:00:00:00:00:0', () => {
        expect(validate.mac('00:00:00:00:00:0')).not.toBeUndefined()
      })
      test('00:0H:00:00:00:00', () => {
        expect(validate.mac('00:0H:00:00:00:00')).not.toBeUndefined()
      })
    })

    test('00:02:00:00:00:00', () => {
      expect(validate.mac('00:02:00:00:00:00')).toBeUndefined()
    })
  })

  describe('specialMac', () => {
    test('specialMac', () => {
      expect(validate.specialMac('0023-00ad-0034')).toBeUndefined()
    })
  })

  describe('ipSpecific', () => {
    test('ipSpecific', () => {
      expect(validate.ipSpecific('192.168.3.1')).toBeUndefined()
    })
    test('illegal ipSpecific', () => {
      expect(validate.ipSpecific('127.168.3.1')).not.toBeUndefined()
      expect(validate.ipSpecific('255.168.3.1')).not.toBeUndefined()
    })
  })

  describe('ip', () => {
    test('ip', () => {
      expect(validate.ip('192.168.3.1')).toBeUndefined()
      expect(validate.ip('192.255.3.1')).toBeUndefined()
    })
    test('illegal ip', () => {
      expect(validate.ip('192.255.3.255')).not.toBeUndefined()
    })
  })

  describe('ipNet', () => {
    test('ipNet', () => {
      expect(validate.ipNet('192.255.3.255')).toBeUndefined()
    })
  })

  describe('privateIP', () => {
    test('privateIP', () => {
      expect(validate.privateIP('10.255.242.2')).toBeUndefined()
      expect(validate.privateIP('172.17.242.2')).toBeUndefined()
      expect(validate.privateIP('192.168.142.2')).toBeUndefined()
    })
    test('illegal privateIP', () => {
      expect(validate.privateIP('110255.242.2')).not.toBeUndefined()
      expect(validate.privateIP('110.255.242.2')).not.toBeUndefined()
      expect(validate.privateIP('172.15.242.2')).not.toBeUndefined()
      expect(validate.privateIP('192.169.242.2')).not.toBeUndefined()
    })
  })

  describe('netSegmentCheck', () => {
    test('netSegmentCheck', () => {
      expect(validate.netSegmentCheck('192.168.3.1', '192.168.3.6', '255.255.255.0')).toBeUndefined()
      expect(validate.netSegmentCheck('192.168.13.1', '192.168.3.6', '255.255.0.0')).toBeUndefined()
    })
    test('illegal netSegmentCheck', () => {
      expect(validate.netSegmentCheck('192.168.3.1', '192.168.13.6', '255.255.255.0')).not.toBeUndefined()
      expect(validate.netSegmentCheck('192.168.13.1', '192.167.3.6', '255.255.0.0')).not.toBeUndefined()
    })
  })

  describe('mask', () => {
    test('mask', () => {
      expect(validate.mask('254.0.0.0')).toBeUndefined()
      expect(validate.mask('255.254.0.0')).toBeUndefined()
      expect(validate.mask('255.255.254.0')).toBeUndefined()
      expect(validate.mask('255.255.255.254')).toBeUndefined()
    })
    test('illegal mask', () => {
      expect(validate.mask('252.255.253.254')).not.toBeUndefined()
      expect(validate.mask('255.252.253.254')).not.toBeUndefined()
      expect(validate.mask('255.255.252.254')).not.toBeUndefined()
      expect(validate.mask('255.255.253.254')).not.toBeUndefined()
    })
  })

  describe('allMask', () => {
    test('allMask', () => {
      expect(validate.allMask('255.255.255.255')).toBeUndefined()
      expect(validate.allMask('254.0.0.0')).toBeUndefined()
      expect(validate.allMask('255.254.0.0')).toBeUndefined()
      expect(validate.allMask('255.255.254.0')).toBeUndefined()
      expect(validate.allMask('255.255.255.254')).toBeUndefined()
    })
    test('illegal allMask', () => {
      expect(validate.allMask('252.255.253.254')).not.toBeUndefined()
      expect(validate.allMask('255.252.253.254')).not.toBeUndefined()
      expect(validate.allMask('255.255.252.254')).not.toBeUndefined()
      expect(validate.allMask('255.255.255.12')).not.toBeUndefined()
    })
  })

  describe('email', () => {
    test('email', () => {
      expect(validate.email('75598233@qq.com')).toBeUndefined()
    })
  })

  describe('hex', () => {
    test('hex', () => {
      expect(validate.hex('0123456789abcdefABCDEF')).toBeUndefined()
    })
    test('illegal hex', () => {
      expect(validate.hex('asf')).not.toBeUndefined()
    })
  })

  describe('chkHalf', () => {
    test('chkHalf', () => {
      expect(validate.chkHalf('this is hale不敢锅')).toBeUndefined()
    })

    test('illegal chkHalf', () => {
      expect(validate.chkHalf('电饭ｊｋｄｆ　都f')).not.toBeUndefined()
    })
  })

  describe('ascii', () => {
    test('ascii', () => {
      expect(validate.ascii('fgdg ')).toBeUndefined()
    })
    test('illegal ascii', () => {
      expect(validate.ascii('電飯鍋fg')).not.toBeUndefined()
      expect(validate.ascii('fgｇｇｈｇｈdg ')).not.toBeUndefined()
    })
  })

  describe('noSpaceStartEnd', () => {
    test('noSpaceStartEnd', () => {
      expect(validate.noSpaceStartEnd('this is no blank')).toBeUndefined()
    })
    test('illegal noSpaceStartEnd', () => {
      expect(validate.noSpaceStartEnd(' this is no blank')).not.toBeUndefined()
      expect(validate.noSpaceStartEnd('this is no blank ')).not.toBeUndefined()
      expect(validate.noSpaceStartEnd('     this is no blank ')).not.toBeUndefined()
    })
  })

  describe('lanMask', () => {
    test('lanMask', () => {
      expect(validate.lanMask('254.0.0.0')).toBeUndefined()
      expect(validate.lanMask('255.254.0.0')).toBeUndefined()
      expect(validate.lanMask('255.255.254.0')).toBeUndefined()
    })
    test('illegal lanMask', () => {
      expect(validate.lanMask('255.255.255.254')).not.toBeUndefined()
      expect(validate.lanMask('252.255.253.254')).not.toBeUndefined()
      expect(validate.lanMask('255.252.253.254')).not.toBeUndefined()
      expect(validate.lanMask('255.255.252.254')).not.toBeUndefined()
      expect(validate.lanMask('255.255.253.254')).not.toBeUndefined()
    })
  })

  describe('noSpace', () => {
    test('noSpace', () => {
      expect(validate.noSpace('jtsdjfgfkdg')).toBeUndefined()
    })
    test('illegal noSpace', () => {
      expect(validate.noSpace('jtsdjfg fkdg')).not.toBeUndefined()
    })
  })
})
