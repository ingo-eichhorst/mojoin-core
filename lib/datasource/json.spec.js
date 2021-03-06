const Json = require('./json')
const Cache = require('../cache')
const fs = require('fs')

const cacheFile = '../db/test-cache.db'

/**
 * make sure db file does not exist
 */
function deleteCache () {
  try {
    fs.unlinkSync('../' + cacheFile)
  } catch (e) { }
}

describe('Json Class', () => {
  beforeEach(() => deleteCache())
  afterEach(() => deleteCache())

  test('queryDatasource throws an error if file does not exists', done => {
    const datasource = new Json({
      name: 'test',
      type: 'json',
      cache: new Cache({
        type: 'sqlite',
        location: cacheFile
      }),
      location: '../file_does_not_exist.json'
    })
    return datasource.queryDatasource().catch(e => {
      expect(e.message).toBe("ENOENT: no such file or directory, open '../file_does_not_exist.json'")
      done()
    })
  })
})
