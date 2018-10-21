const Datasource = require('./datasource')
const Cache = require('../cache')
const fs = require('fs')

const cacheFile = '../../db/test-cache.db'

describe('Datasource Class', () => {
  beforeEach(() => {
    // make sure db file does not exist
    try {
      fs.unlinkSync(cacheFile)
    } catch (e) {}
  })

  afterEach(() => {
    try {
      fs.unlinkSync(cacheFile)
    } catch (e) {}
  })

  test('queryDatasource throws an error because no specific datasource is defined', () => {
    const datasource = new Datasource({
      name: 'test',
      type: 'test',
      cache: new Cache({
        type: 'sqlite',
        location: cacheFile
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
      expect(e.message).toBe('requires property "name"')
    }

    try {
      const datasource = new Datasource({ name: 'test' })
      expect(datasource).toBe('never reach this point')
    } catch (e) {
      expect(e.message).toBe('requires property "type"')
    }

    try {
      const datasource = new Datasource({
        name: 'test',
        type: 'test'
      })
      expect(datasource).toBe('never reach this point')
    } catch (e) {
      expect(e.message).toBe('requires property "location"')
    }

    try {
      const datasource = new Datasource({
        name: 'test',
        type: 'test',
        location: 'test'
      })
      expect(datasource).toBe('never reach this point')
    } catch (e) {
      expect(e.message).toBe('options.cache as instance of Cache is required')
    }
  })
})
