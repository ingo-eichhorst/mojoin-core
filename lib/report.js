'use strict'

class Report {
  constructor ({cache, query}) {
    this.cache = cache
    this.table = query.table
    this.query = query
    this.name = query.table + '_' + (new Date()).toISOString()
  }

  async generate () {
    const report = await this.cache.query(this.table, this.query.query)
    this.data = report
    return report
  }
}

module.exports = Report
