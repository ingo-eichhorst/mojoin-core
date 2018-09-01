const Mojoin = require('./index')

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
})
