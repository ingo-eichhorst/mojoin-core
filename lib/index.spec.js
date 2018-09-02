const Mojoin = require('./index')
const nock = require('nock')
const fs = require('fs')

describe('Mojoin Library', () => {
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
    const mojoin = new Mojoin([
      {
        name: 'todos',
        type: 'json',
        location: './examples/datasource/todos.json'
      }
    ])

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

    nock('https://localhost')
      .persist()
      .get('/users')
      .reply(200, users)

    nock('https://localhost:27017')
      .persist()
      .get('/albums')
      .reply(200, albums)

    // make sure db file does not exist
    try {
      fs.unlinkSync('../db/complex-datasources-cache.db')
    } catch (e) {}

    const mojoin = new Mojoin({
      cache: { type: 'sqlite', location: '../db/complex-datasources-cache.db' },
      datasources: [
        {
          name: 'todos',
          type: 'json',
          location: './examples/datasource/todos.json'
        },
        {
          name: 'users',
          type: 'rest',
          location: 'https://localhost/users'
        },
        {
          name: 'albums',
          type: 'mongodb',
          location: 'https://localhost:27017/albums'
        }
      ]
    })

    mojoin.syncAll().then(() => {
      mojoin
        .generateReport({
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
        })
        .then(report => {
          expect(Array.isArray(report)).toBeTruthy()
          expect(report).toHaveLength(12)
          expect(report[0].user.id).toEqual(2)
          expect(report[0].user.address.geo.lat).toEqual('-43.9509')
          expect(report[0].album.title).toEqual(
            'sunt qui excepturi placeat culpa'
          )
          fs.unlinkSync('../db/complex-datasources-cache.db')
          done()
        })
    })
  })
})
