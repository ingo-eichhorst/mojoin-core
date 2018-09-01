const Cache = require('./cache')

describe('Cache', () => {
  test('Test connection to cache - success', done => {
    const cache = new Cache({ type: 'sqlite', location: '../db/cache.db' })
    cache.test().then(testResult => {
      expect(testResult).toEqual({ connected: true })
      done()
    })
  })
})
