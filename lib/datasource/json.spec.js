const Json = require('./json')
const Cache = require('../cache')
const path = require('path')

describe('Json Class', () => {
  test('queryDatasource throws an error if file does not exists', done => {
    const datasource = new Json({
      name: 'test',
      type: 'json',
      cache: new Cache({
        type: 'sqlite',
        location: path.join(__dirname, '../db/json-test-cache.db')
      }),
      location: '../file_does_not_exist.json'
    })
    return datasource.queryDatasource().catch(e => {
      expect(e.message).toBe("ENOENT: no such file or directory, open '../file_does_not_exist.json'")
      done()
    })
  })
})
