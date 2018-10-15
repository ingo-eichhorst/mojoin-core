const Cache = require('./cache')
const fs = require('fs')

describe('Cache', () => {
  test('Test connection to cache - success', done => {
    const cache = new Cache({ type: 'sqlite', location: '../db/cache.db' })
    cache.test().then(testResult => {
      expect(testResult).toEqual({ connected: true })
      done()
    })
  })

  test('Init sqlite cache with new db file', done => {
    // make sure db file does not exist
    try {
      fs.unlinkSync('../db/new-cache.file.db')
    } catch (e) {}

    const cache = new Cache({
      type: 'sqlite',
      location: '../db/new-cache.file.db'
    })
    cache.test().then(testResult => {
      expect(testResult).toEqual({ connected: true })
      fs.unlinkSync('../db/new-cache.file.db')
      done()
    })
  })

  test('query cache error', done => {
    // make sure db file does not exist
    try {
      fs.unlinkSync('../db/test-cache.file.db')
    } catch (e) {}

    const cache = new Cache({
      type: 'sqlite',
      location: '../db/test-cache.file.db'
    })
    cache
      .test()
      .then(() => cache.query({ table: 'test' }))
      .catch(e => {
        expect(e.message).toEqual('No test table')
        fs.unlinkSync('../db/test-cache.file.db')
        done()
      })
  })

  test('unsert table from cache error', done => {
    // make sure db file does not exist
    try {
      fs.unlinkSync('../db/test-cache.file.db')
    } catch (e) {}

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
      location: '../db/test-cache.file.db'
    })
    cache
      .test()
      .then(() => cache.upsertTable('test', schema, 'id'))
      .catch(e => {
        expect(e.message).toEqual('Unrecognized data type for field id')
        fs.unlinkSync('../db/test-cache.file.db')
        done()
      })
  })
})
