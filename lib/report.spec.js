const Report = require('./report')

describe('report', () => {
  test('Instantiate with wrong values', () => {
    expect(new Report({cache: {}, query: {}}).cache).toEqual({})
    expect(new Report({cache: {}, query: {}}).query).toEqual({})
  })
})
