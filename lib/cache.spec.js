const Cache = require('./cache')
const fs = require('fs')

const cacheFile = '../db/test-cache.db'

/**
 * make sure db file does not exist
 */
function deleteCache () {
  try {
    fs.unlinkSync(cacheFile)
  } catch (e) { }
}

describe('Cache', () => {
  beforeEach(() => deleteCache())
  afterEach(() => deleteCache())

  test('Test connection to cache - success', done => {
    const cache = new Cache({ type: 'sqlite', location: '../db/cache.db' })
    cache.test().then(testResult => {
      expect(testResult).toEqual({ connected: true })
      done()
    })
  })

  test('Init sqlite cache with new db file', done => {
    const cache = new Cache({
      type: 'sqlite',
      location: cacheFile
    })
    cache.test().then(testResult => {
      expect(testResult).toEqual({ connected: true })
      done()
    })
  })

  test('query cache error', done => {
    const cache = new Cache({
      type: 'sqlite',
      location: cacheFile
    })
    cache
      .test()
      .then(() => cache.query({ table: 'test' }))
      .catch(e => {
        expect(e.message).toEqual('No test table')
        done()
      })
  })

  test('unsert table from cache error', done => {
    const schema = {
      id: {
        unique: true,
        allowNull: true,
        primaryKey: true
      },
      title: {
        unique: false,
        allowNull: true
      }
    }

    const cache = new Cache({
      type: 'sqlite',
      location: cacheFile
    })
    cache
      .test()
      .then(() => cache.upsertTable('test', schema, 'id'))
      .catch(e => {
        expect(e.message).toEqual('Unrecognized data type for field id')
        done()
      })
  })
})
