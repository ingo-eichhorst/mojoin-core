'use strict'
// TODO: require all files in the folder
const Json = require('./json')
const MongoDb = require('./mongodb')
const REST = require('./rest')
const schema = require('./datasource.schema')

module.exports = ({ type, cache, location, name, idField, privateSshKey }) => {
  if (type === 'json') return new Json({ type, cache, location, name })
  else if (type === 'mongodb') {
    return new MongoDb({ type, cache, location, name, idField, privateSshKey })
  } else if (type === 'rest') return new REST({ type, cache, location, name })
}
