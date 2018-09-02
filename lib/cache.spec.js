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
})
