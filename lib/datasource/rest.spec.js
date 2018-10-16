const Rest = require('./rest')
const Cache = require('../cache')
const path = require('path')
const nock = require('nock')

describe('Json Class', () => {
  nock('http://localhost:1234')
    .get('/error')
    .reply(500, 'Error')

  test('queryDatasource throws an error on connection error', done => {
    const datasource = new Rest({
      name: 'test',
      type: 'rest',
      cache: new Cache({
        type: 'sqlite',
        location: path.join(__dirname, '../db/rest-test-cache.db')
      }),
      location: 'http://localhost:1234/error'
    })
    return datasource.queryDatasource().catch(e => {
      expect(e.message).toBe('Request failed with status code 500')
      done()
    })
  })

  nock('http://localhost:1234')
    .get('/query?limit=2&offset=0')
    .reply(200, [{ id: 1 }, { id: 2 }])

  test('queryDatasource with query pagination', done => {
    const datasource = new Rest({
      name: 'test',
      type: 'rest',
      paginationLimitParam: 'limit',
      paginationPageSize: 2,
      paginationOffsetParam: 'offset',
      paginationPlacement: 'query',
      cache: new Cache({
        type: 'sqlite',
        location: path.join(__dirname, '../db/rest-test-cache.db')
      }),
      location: 'http://localhost:1234/query'
    })
    return datasource.queryDatasource({offset: 0}).then(result => {
      expect(result).toHaveLength(2)
      done()
    })
  })

  nock('http://localhost:1234', {
    reqheaders: {
      'limit': 2,
      'offset': 0
    }
  })
    .get('/header')
    .reply(200, [{ id: 1 }, { id: 2 }])

  test('queryDatasource with header pagination', done => {
    const datasource = new Rest({
      name: 'test',
      type: 'rest',
      paginationLimitParam: 'limit',
      paginationPageSize: 2,
      paginationOffsetParam: 'offset',
      paginationPlacement: 'header',
      cache: new Cache({
        type: 'sqlite',
        location: path.join(__dirname, '../db/rest-test-cache.db')
      }),
      location: 'http://localhost:1234/header'
    })
    return datasource.queryDatasource({offset: 0}).then(result => {
      expect(result).toHaveLength(2)
      done()
    })
  })

  nock('http://localhost:1234')
    .get('/modified?updatedAfter=')
    .reply(200, [{ id: 1 }, { id: 2 }])

  test('queryDatasource with query modifiedField', done => {
    const datasource = new Rest({
      name: 'modified-test',
      type: 'rest',
      modifiedParam: 'updatedAfter',
      modifiedField: 'modifiedAt',
      cache: new Cache({
        type: 'sqlite',
        location: path.join(__dirname, '../db/rest-test-cache.db')
      }),
      location: 'http://localhost:1234/modified'
    })
    return datasource.queryDatasource({offset: 0}).then(result => {
      expect(result).toHaveLength(2)
      done()
    })
  })
})
