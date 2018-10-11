'use strict'

const Cache = require('./cache')

/**
 * Test if a cache object is correct
 *
 * @param {object} cacheInstance
 */
function checkCache (cacheInstance) {
  if (
    !cacheInstance ||
    typeof cacheInstance !== 'object' ||
    !(cacheInstance instanceof Cache)
  ) {
    throw new Error('options.cache as instance of Cache is required')
  }
}

module.exports = {
  checkCache
}
