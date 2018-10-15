const MongoDb = require('./mongodb')
const Cache = require('../cache')
const path = require('path')

describe('MongoDb Class', () => {
  test('queryDatasource throws an error if the protocol is not supported', () => {
    const datasource = new MongoDb({
      name: 'test',
      type: 'mongodb',
      cache: new Cache({
        type: 'sqlite',
        location: path.join(__dirname, '../db/mongo-test-cache.db')
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
        location: path.join(__dirname, '../db/mongo-test-cache.db')
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
        location: path.join(__dirname, '../db/mongo-test-cache.db')
      }),
      location: 'ssh://user:password@domain/db/connection-error'
    })
    return datasource.queryDatasource().catch(e => {
      expect(e.message).toEqual('Error occured')
    })
  })
})
