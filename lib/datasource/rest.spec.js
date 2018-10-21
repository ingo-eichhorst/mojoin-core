const Rest = require('./rest')
const Cache = require('../cache')
const nock = require('nock')
const fs = require('fs')

const cacheFile = '../db/test-cache.db'

/**
 * make sure db file does not exist
 */
function deleteCache () {
  try {
    fs.unlinkSync('../' + cacheFile)
  } catch (e) {}
}

describe('Rest Class', () => {
  beforeEach(() => deleteCache())
  afterEach(() => deleteCache())

  nock('http://localhost:1234')
    .get('/error')
    .reply(500, 'Error')

  test('queryDatasource throws an error on connection error', done => {
    const datasource = new Rest({
      name: 'test',
      type: 'rest',
      cache: new Cache({
        type: 'sqlite',
        location: cacheFile
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
        location: cacheFile
      }),
      location: 'http://localhost:1234/query'
    })
    return datasource.queryDatasource({ offset: 0 }).then(result => {
      expect(result).toHaveLength(2)
      done()
    })
  })

  nock('http://localhost:1234', {
    reqheaders: {
      limit: 2,
      offset: 0
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
        location: cacheFile
      }),
      location: 'http://localhost:1234/header'
    })
    return datasource.queryDatasource({ offset: 0 }).then(result => {
      expect(result).toHaveLength(2)
      done()
    })
  })

  nock('http://localhost:1234')
    .get('/modified?updatedAfter=2018-01-01T12:00:00.000Z')
    .reply(200, [
      { id: 1, modifiedAt: '2018-01-02T12:00:00.000Z' },
      { id: 2, modifiedAt: '2018-01-02T12:00:00.000Z' }
    ])

  test('queryDatasource with query modifiedField', done => {
    const datasource = new Rest({
      name: 'modified-test',
      type: 'rest',
      modifiedParam: 'updatedAfter',
      modifiedField: 'modifiedAt',
      cache: new Cache({
        type: 'sqlite',
        location: cacheFile
      }),
      location: 'http://localhost:1234/modified'
    })
    return datasource
      .queryDatasource({
        modifiedAfter: new Date('2018-01-01T12:00:00Z'),
        offset: 0
      })
      .then(result => {
        expect(result).toHaveLength(2)
        done()
      })
  })
})
