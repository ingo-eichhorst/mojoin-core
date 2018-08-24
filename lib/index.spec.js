const Mojoin = require('./index')

describe('Mojoin Library', () => {
  test('Instantiate mojoin with default cache', () => {
    const mojoin = new Mojoin([
      {
        name: 'todos',
        type: 'json',
        location: './datasource/todos.json'
      }
    ])
    expect(mojoin.datasources).toHaveLength(1)
    expect(mojoin.datasources[0].cache.location.includes('/db/cache.db')).toBeTruthy()
    expect(mojoin.datasources[0].cache.databaseName).toBe('mojoin-cache')
    expect(mojoin.datasources[0].cache.sequelize).toBeDefined()
  })
})
