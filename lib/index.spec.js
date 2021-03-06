const Mojoin = require('./index')
const nock = require('nock')
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

describe('Mojoin Library', () => {
  beforeEach(() => deleteCache())
  afterEach(() => deleteCache())

  test('Instantiate mojoin', () => {
    const mojoin = new Mojoin([
      {
        name: 'todos',
        type: 'json',
        location: './examples/datasource/todos.json'
      }
    ])
    expect(mojoin.datasources).toHaveLength(1)
    expect(
      mojoin.datasources[0].cache.location.includes('/db/cache.db')
    ).toBeTruthy()
    expect(mojoin.datasources[0].cache.databaseName).toBe('mojoin-cache')
    expect(mojoin.datasources[0].cache.sequelize).toBeDefined()
  })

  test('Sync all mojoin datasources', done => {
    const mojoin = new Mojoin([
      {
        name: 'todos',
        type: 'json',
        location: './examples/datasource/todos.json'
      }
    ])

    mojoin.syncAll().then(syncResult => {
      expect(syncResult[0].syncedEntities).toBe(200)
      done()
    })
  })

  test('generate report from mojoin cache', done => {
    const mojoin = new Mojoin({
      cache: { type: 'sqlite', location: cacheFile },
      datasources: [{
        name: 'todos',
        type: 'json',
        location: './examples/datasource/todos.json'
      }]
    })

    mojoin.syncAll().then(() => {
      mojoin
        .generateReport({
          table: 'todos',
          where: {
            userId: 2,
            completed: 1
          }
        })
        .then(report => {
          expect(Array.isArray(report)).toBeTruthy()
          expect(report).toHaveLength(8)
          expect(report[0].id).toBe(22)
          expect(report[0].title).toBe(
            'distinctio vitae autem nihil ut molestias quo'
          )
          done()
        })
    })
  })

  test('instantiate multiple datasources and generate report with new cache', done => {
    const users = require('../examples/datasource/users.json')
    const albums = require('../examples/datasource/albums.json')

    nock('http://localhost:1234')
      .persist()
      .get('/users')
      .reply(200, users)

    nock('https://localhost:27017')
      .persist()
      .get('/albums')
      .reply(200, albums)

    const mojoin = new Mojoin({
      cache: { type: 'sqlite', location: cacheFile },
      datasources: [
        {
          name: 'todos',
          type: 'json',
          location: './examples/datasource/todos.json'
        },
        {
          name: 'users',
          type: 'rest',
          location: 'http://localhost:1234/users'
        },
        {
          name: 'albums',
          type: 'mongodb',
          location: 'mongodb://localhost:27017/album-db/albums'
        }
      ]
    })

    mojoin.syncAll().then(r => {
      expect(r).toHaveLength(3)
      expect(r[0].syncedEntities).toEqual(200)

      mojoin.generateReport({
        table: 'todos',
        where: {
          userId: 2,
          completed: 0
        },
        include: [
          {
            model: 'users',
            foreignKey: 'userId'
          },
          {
            model: 'albums',
            foreignKey: 'userId'
          }
        ]
      }).then(report => {
        expect(Array.isArray(report)).toBeTruthy()
        expect(report).toHaveLength(12)
        expect(report[0].user.id).toEqual(2)
        expect(report[0].user.address.geo.lat).toEqual('-43.9509')
        expect(report[0].album.title).toEqual(
          'sunt qui excepturi placeat culpa'
        )
        done()
      })
    })
  })
})
