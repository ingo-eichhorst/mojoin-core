const Datasource = require('./datasource')
const Cache = require('../cache')
const path = require('path')

const schema = require('./datasource.schema')

describe('Datasource Class', () => {
  test('queryDatasource throws an error because no specific datasource is defined', () => {
    const datasource = new Datasource({
      name: 'test',
      type: 'test',
      cache: new Cache({
        type: 'sqlite',
        location: path.join(__dirname, '../db/test-cache.db')
      }),
      location: 'test'
    })
    return datasource.queryDatasource().catch(e => {
      expect(e.message).toBe('Query datasource not implemented for: test')
    })
  })

  test('Json instanziation throws error - on missing schema', () => {
    try {
      const datasource = new Datasource({}).validate()
      expect(datasource).toBe('never reach this point')
    } catch (e) {
      expect(e.message).toBe('no schema for input validation provided')
    }
  })

  test('Json instanziation throws error - on missing input', () => {
    try {
      const datasource = new Datasource({ schema: schema }).validate()
      expect(datasource).toBe('never reach this point')
    } catch (e) {
      expect(e.message).toBe(
        'Validation error: instance requires property "name", instance requires property "type", instance requires property "location"'
      )
    }
  })

  test('Json instanziation throws error - on missing cache object', () => {
    try {
      const datasource = new Datasource({
        name: 'test',
        type: 'test',
        location: 'test',
        schema: schema
      }).validate()
      expect(datasource).toBe('never reach this point')
    } catch (e) {
      expect(e.message).toBe('options.cache as instance of Cache is required')
    }
  })
})
