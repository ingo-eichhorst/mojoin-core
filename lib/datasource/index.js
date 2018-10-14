'use strict'
// TODO: require all files in the folder
const Json = require('./json')
const MongoDb = require('./mongodb')
const REST = require('./rest')

module.exports = ({
  type,
  cache,
  location,
  name,
  idField,
  privateSshKey,
  paginationPlacement,
  paginationPageSize,
  paginationLimitParam,
  paginationOffsetParam
}) => {
  if (type === 'json') return new Json({ type, cache, location, name })
  else if (type === 'mongodb') {
    return new MongoDb({
      type,
      cache,
      location,
      name,
      idField,
      privateSshKey,
      paginationPageSize
    })
  } else if (type === 'rest') {
    return new REST({
      type,
      cache,
      location,
      name,
      paginationPlacement,
      paginationPageSize,
      paginationLimitParam,
      paginationOffsetParam
    })
  }
}
