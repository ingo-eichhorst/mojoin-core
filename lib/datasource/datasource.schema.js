
module.exports = {
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
