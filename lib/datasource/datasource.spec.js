const Datasource = require('./datasource')
const Cache = require('../cache')
const path = require('path')

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

  test('datasource instanziation throws error if nessesary input is missing', () => {
    try {
      const datasource = new Datasource({})
      expect(datasource).toBe('never reach this point')
    } catch (e) {
      expect(e.message).toBe('options.name of type string is required')
    }

    try {
      const datasource = new Datasource({ name: 'test' })
      expect(datasource).toBe('never reach this point')
    } catch (e) {
      expect(e.message).toBe('options.type of type string is required')
    }

    try {
      const datasource = new Datasource({ name: 'test', type: 'test' })
      expect(datasource).toBe('never reach this point')
    } catch (e) {
      expect(e.message).toBe('options.cache as instance of Cache is required')
    }

    try {
      const datasource = new Datasource({
        name: 'test',
        type: 'test',
        cache: new Cache({
          type: 'sqlite',
          location: path.join(__dirname, '../db/test-cache.db')
        })
      })
      expect(datasource).toBe('never reach this point')
    } catch (e) {
      expect(e.message).toBe('options.location of type string is required')
    }
  })
})
