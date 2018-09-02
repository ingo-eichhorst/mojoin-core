const Datasource = require('./datasource')

describe('Datasource Class', () => {
  test('queryDatasource throws an error because no specific datasource is defined', () => {
    const datasource = new Datasource({ type: 'test' })
    return datasource.queryDatasource().catch(e => {
      expect(e.message).toBe('Query datasource not implemented for: test')
    })
  })
})
