import * as util from '../lib/util'

global._ = function (val) {
  return val;
}

describe('util test', () => {
  describe('getType', () => {
    test('test Object', () => {
      expect(util.getType({})).toBe('Object')
    })
    test('test String', () => {
      expect(util.getType('')).toBe('String')
    })
    test('test Array', () => {
      expect(util.getType([])).toBe('Array')
    })
  })

  describe('isObject', () => {
    test('{} to be true', () => {
      expect(util.isObject({})).toBeTruthy()
    })
    test('[] to be false', () => {
      expect(util.isObject([])).toBeFalsy()
    })
    test('123 to be false', () => {
      expect(util.isObject(123)).toBeFalsy()
    })
  })

  describe('isEmptyObject', () => {
    test('{} is empty Objsct', () => {
      expect(util.isEmptyObject({})).toBeTruthy()
    })
    test('[] is empty Objsct', () => {
      expect(util.isEmptyObject([])).toBeTruthy()
    })
  })

  describe('isDefined', () => {
    test('undefined to be false', () => {
      expect(util.isDefined()).toBeFalsy()
    })
    test('null to be false', () => {
      expect(util.isDefined(null)).toBeFalsy()
    })
    test('{} to be true', () => {
      expect(util.isDefined({})).toBeTruthy()
    })
  })

  describe('isUndef', () => {
    test('undefined to be true', () => {
      expect(util.isUndef()).toBeTruthy()
    })
    test('null to be true', () => {
      expect(util.isUndef(null)).toBeTruthy()
    })
    test('{} to be false', () => {
      expect(util.isUndef({})).toBeFalsy()
    })
  })

  describe('ipToInt', () => {
    test('192.168.0.1 to be 3232235521', () => {
      expect(util.ipToInt('192.168.0.1')).toBe(3232235521)
    })
  })

  describe('isSameNet', () => {
    test('isSameNet', () => {
      expect(util.isSameNet('192.168.3.1', '192.168.3.2', '255.255.255.0', '255.255.255.0')).toBeTruthy()
      expect(util.isSameNet('192.168.3.1', '192.168.13.2', '255.255.255.0', '255.255.255.0')).toBeFalsy()
    })
  })

  describe('deepClone', () => {
    var arr = [obj1, 12, 23]
    var obj = {
      a: 1,
      b: 2,
      c: obj1,
      d: arr
    },
      obj1 = {
        a: obj,
        b: {
          c: obj,
          d: arr
        },
        c: 2
      }

    let clone = util.deepClone(obj1)
    test('object clone', () => {
      expect(clone.a).not.toBe(obj1.a)
      expect(clone.a).toEqual(obj1.a)
      expect(clone.b).not.toBe(obj1.b)
      expect(clone.b).toEqual(obj1.b)
      expect(clone.c).toBe(obj1.c)
    })
    test('array clone', () => {
      expect(clone.b.d).not.toBe(obj1.b.d)
      expect(clone.b.d).toEqual(obj1.b.d)
    })
    test('primite clone', () => {

    })
  })

  describe('debounce', () => {
    describe('immediate = true', () => {
      let result = 0
      function testfn () {
        result = 1
      }
      let testImmediate = util.debounce(testfn, 100, true)

      it('test sync', () => {
        testImmediate()
        expect(result).toBe(1)
        result = 0
        testImmediate()
      })

      it('check sync', () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 200)
          testImmediate()
        }).then(() => {
          expect(result).toBe(0)
        })
      })
    })

    describe('immediate = false', () => {
      let resultNoImme = 0
      function testNoImme () {
        resultNoImme++
      }
      let testImmediate = util.debounce(testNoImme, 100)
      it('test sync', () => {
        testImmediate()
        expect(resultNoImme).toBe(0)
        testImmediate()
        testImmediate()
        testImmediate()
        testImmediate()
      })

      it('check sync', () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 200)
        }).then(() => {
          expect(resultNoImme).toBe(1)
        })
      })
    })
  })

  describe('throttle', () => {
    let result = 0
    function testFn () {
      result++
    }
    let throttle = util.throttle(testFn, 100)
    test('throttle', () => {
      throttle()
      setTimeout(() => {
        throttle()
      }, 50)
      throttle()
      return myPromise(100).then(() => {
        expect(result).toBe(1)
        throttle()
        throttle()
        return myPromise(100)
      }).then(() => {
        expect(result).toBe(2)
        throttle()
        return myPromise(100)
      }).then(() => {
        expect(result).toBe(3)
      })
    })
  })

  function myPromise (time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, time)
    })
  }

  describe('encodeText', () => {
    test('< >"\'&', () => {
      expect(util.encodeText('< >"\'&')).toBe('&lt;&nbsp;&gt;&quot;&#39;&amp;')
    })
  })

  describe('decodeText', () => {
    test('&lt;&nbsp;&gt;&quot;&#39;&amp;', () => {
      expect(util.decodeText('&lt;&nbsp;&gt;&quot;&#39;&amp;')).toBe('< >"\'&')
    })
  })

  describe('guid', () => {
    test('yanz', () => {
      let set = new Set();
      let size = 1000;
      for (let i = 0; i < size; i++) {
        set.add(util.guid());
      }
      expect(set.size).toEqual(size)
    })
  })
})
