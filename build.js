const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const less = require('less')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

// There's sth not expected in `less-plugin-autoprefix`
// so use postcss instead

promisify(fs.readFile)(path.resolve('index.less'), { encoding: 'utf-8' })
  .then(function transformCode (code) {
    return less.render(code)
  })
  .then(function postcssTransform (output) {
    return postcss([ autoprefixer ]).process(output.css, { from: undefined })
  })
  .then(function outputCompiledCode (result) {
    return Promise.all[
      promisify(fs.writeFile)(path.resolve('dist/index.css'), result.css),
      result.map && promisify(fs.writeFile)(path.resolve('dist/index.css.map'), result.map)
    ]
  })
  .then(function logSuccess () {
    console.log('done')
  })
  .catch(function logError (error) {
    console.error(error)
  })
