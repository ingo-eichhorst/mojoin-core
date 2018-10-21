const MongoDb = require('./mongodb')
const Cache = require('../cache')
const path = require('path')
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

describe('MongoDb Class', () => {
  beforeEach(() => deleteCache())
  afterEach(() => deleteCache())

  test('queryDatasource throws an error if the protocol is not supported', () => {
    const datasource = new MongoDb({
      name: 'test',
      type: 'mongodb',
      cache: new Cache({
        type: 'sqlite',
        location: cacheFile
      }),
      location: 'wrong-proto://domain/path'
    })
    return datasource.queryDatasource().catch(e => {
      expect(e.message).toBe(
        'MongoBD connection protocol not supportrd. Use: mongodb or ssh'
      )
    })
  })

  test('queryDatasource over ssh', () => {
    const datasource = new MongoDb({
      name: 'test',
      type: 'mongodb',
      cache: new Cache({
        type: 'sqlite',
        location: cacheFile
      }),
      location: 'ssh://user:password@domain/db/collection'
    })
    return datasource.queryDatasource().then(r => {
      expect(r).toEqual([{ id: 1 }, { id: 2 }])
    })
  })

  test('queryDatasource over ssh with pagination', () => {
    const datasource = new MongoDb({
      name: 'test',
      type: 'mongodb',
      paginationPageSize: 1,
      cache: new Cache({
        type: 'sqlite',
        location: path.join(__dirname, '../db/mongo-test-cache.db')
      }),
      location: 'ssh://user:password@domain/db/collection'
    })
    return datasource.queryDatasource({ offset: 0 }).then(r => {
      expect(r).toEqual([{ id: 1 }])
    })
  })

  test('throws an error if queryDatasource over ssh is not possible', () => {
    const datasource = new MongoDb({
      name: 'test',
      type: 'mongodb',
      cache: new Cache({
        type: 'sqlite',
        location: cacheFile
      }),
      location: 'ssh://user:password@domain/db/connection-error'
    })
    return datasource.queryDatasource().catch(e => {
      expect(e.message).toEqual('Error occured')
    })
  })

  test('queryDatasource over ssh with last modified date', () => {
    const datasource = new MongoDb({
      name: 'test',
      type: 'mongodb',
      modifiedField: 'modifiedAt',
      cache: new Cache({
        type: 'sqlite',
        location: cacheFile
      }),
      location: 'ssh://user:password@domain/db/collection'
    })
    return datasource
      .queryDatasource({
        modifiedAfter: new Date('2018-01-01T12:00:00Z'),
        offset: 0
      })
      .then(r => {
        expect(r).toEqual([{ id: 3 }, { id: 4 }])
      })
  })

  test('queryDatasource over mongodb protocol with last modified date', () => {
    const datasource = new MongoDb({
      name: 'test',
      type: 'mongodb',
      modifiedField: 'modifiedAt',
      cache: new Cache({
        type: 'sqlite',
        location: cacheFile
      }),
      location: 'mongodb://user:password@domain/db/collection'
    })
    return datasource
      .queryDatasource({
        modifiedAfter: new Date('2018-01-01T12:00:00Z'),
        offset: 0
      })
      .then(r => {
        expect(r).toEqual([
          {
            id: 99,
            modifiedAt: '2019-01-01T12:00:00Z',
            title: 'consectetur ut id impedit dolores sit ad ex aut',
            userId: 10
          },
          {
            id: 100,
            modifiedAt: '2019-01-01T12:00:00Z',
            title: 'enim repellat iste',
            userId: 10
          }
        ])
      })
  })
})
