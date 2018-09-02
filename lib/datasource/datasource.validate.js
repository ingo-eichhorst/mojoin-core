const Cache = require('../cache')
const validateScheam = require('jsonschema').validate

const datasourceSchema = {
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://example.com/root.json',
  type: 'object',
  title: 'Datasource Schema',
  required: ['name', 'type', 'location'],
  properties: {
    name: {
      $id: '#/properties/name',
      type: 'string',
      title: 'The Name Schema',
      default: '',
      examples: ['test'],
      pattern: '^(.*)$'
    },
    type: {
      $id: '#/properties/type',
      type: 'string',
      title: 'The Type Schema',
      default: '',
      examples: ['test'],
      pattern: '^(.*)$'
    },
    location: {
      $id: '#/properties/location',
      type: 'string',
      title: 'The Location Schema',
      default: '',
      examples: ['test'],
      pattern: '^(.*)$'
    }
  }
}

module.exports = function validate ({ name, type, cache, location }) {
  validateScheam({ name, type, location }, datasourceSchema, {
    throwError: true
  })

  if (!cache || typeof cache !== 'object' || !(cache instanceof Cache)) {
    throw new Error('options.cache as instance of Cache is required')
  }
}
