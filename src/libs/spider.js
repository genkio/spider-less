'use strict'

const request = require('request')
const iconv = require('iconv-lite')
const signale = require('signale')
const BufferHelper = require('bufferhelper')

function crawl (url) {
  signale.info(`Start scraping: ${url}`)

  let charSet = ''
  return new Promise((resolve, reject) => {
    const bufferHelper = new BufferHelper()
    request({ url })
      .on('error', err => {
        return reject(err)
      })
      .on('response', res => {
        charSet = getCharSet(res.headers)
        res.on('data', chunk => {
          bufferHelper.concat(chunk)
        })
      })
      .on('end', () => {
        const html = iconv.decode(bufferHelper.toBuffer(), charSet)
        return resolve(html)
      })
  })
}

function getCharSet(headers) {
  let charSet = 'UTF-8'
  try {
    charSet = /charset=(.*)/.exec(headers['content-type'])[1]
  } catch (err) {
    signale.debug('Error parsing charset', headers)
  }
  return charSet
}

module.exports = {
  crawl
}
