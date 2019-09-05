const buble = require('rollup-plugin-buble')
const rollup = require('rollup')
const path = require('path')
const fs = require('fs')
const resolve = _path => path.resolve(__dirname, _path)
const pack = require('./package.json')

const banner = '/*!\n' +
  ` * ${pack.name} v${pack.version} \n` +
  ` * (c) ${new Date().getFullYear()} ${pack.author.name}\n` +
  ' */'

const entrys = {
  commonjs: {
    entry: resolve('./index.js'),
    dest: resolve(`dist/${pack.name}.common.js`),
    format: 'cjs'
  },
  cjsUtil: {
    entry: resolve('./lib/util.js'),
    dest: resolve(`dist/${pack.name}.util.common.js`),
    format: 'cjs'
  },
  cjsValidate: {
    entry: resolve('./lib/validate.js'),
    dest: resolve(`dist/${pack.name}.validate.common.js`),
    format: 'cjs'
  },
  esm: {
    entry: './index.js',
    dest: resolve(`dist/${pack.name}.esm.js`),
    format: 'es'
  },
  esmUtil: {
    entry: resolve('./lib/util.js'),
    dest: resolve(`dist/${pack.name}.util.esm.js`),
    format: 'es'
  },
  esmValidate: {
    entry: resolve('./lib/validate.js'),
    dest: resolve(`dist/${pack.name}.validate.esm.js`),
    format: 'es'
  }
}

function genConfig (opts) {
  const config = {
    input: opts.entry,
    output: {
      file: opts.dest,
      name: pack.name,
      format: opts.format,
      banner
    },
    plugins: [
      buble()
    ]
  }
  return config
}

function getEntrys () {
  return Object.keys(entrys).map(key => genConfig(entrys[key]))
}

function build () {
  let built = 0
  const entrys = getEntrys()
  const total = entrys.length
  const next = () => {
    buildEntry(entrys[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }
  next()
}

function buildEntry (config) {
  const output = config.output
  const { file } = output
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then((data) => {
      // console.log(data)
      data = data.output[0]
      return write(file, data.code)
    })
}

function write (dest, code) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }
    createFolder(dest)
    fs.writeFile(dest, code, err => {
      if (err) { return reject(err) }
      report()
    })
  })
}

function createFolder (filePath) {
  const paths = []
  filePath = path.dirname(filePath)
  while (!fs.existsSync(filePath)) {
    paths.push(filePath)
    filePath = path.dirname(filePath)
  }

  while (paths.length > 0) {
    fs.mkdirSync(paths.pop())
  }
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

// 入口
build()
