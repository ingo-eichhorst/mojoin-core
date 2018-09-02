const Cache = require('../cache')

module.exports = function validate (options) {
  const { name, type, cache, location } = options
  if (!name || typeof name !== 'string') {
    throw new Error('options.name of type string is required')
  } else if (!type || typeof type !== 'string') {
    throw new Error('options.type of type string is required')
  } else if (!cache || typeof cache !== 'object' || !(cache instanceof Cache)) {
    throw new Error('options.cache as instance of Cache is required')
  } else if (!location || typeof location !== 'string') {
    throw new Error('options.location of type string is required')
  }
}
