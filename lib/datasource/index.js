'use strict'
// TODO: require all files in the folder
const Json = require('./json')
const MongoDb = require('./mongodb')
const REST = require('./rest')
const schema = require('./datasource.schema')

module.exports = ({ type, cache, location, name, idField }) => {
  const options = { type, cache, location, name, idField }
  if (type === 'json') return new Json({ ...options, schema })
  else if (type === 'mongodb') {
    return new MongoDb({ ...options, schema })
  } else if (type === 'rest') return new REST({ ...options, schema })
  else throw new Error('unsupported datasource type')
}
