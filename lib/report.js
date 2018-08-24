'use strict'

/**
 * Report that contains the cache query result and additional metadata
 * regarding the query. A report can be exported in different formats.
 */
class Report {
  /**
   * Report constructor
   *
   * @param {object} options.cache - cache instance to query
   *                 options.query - query that should be performed on the cache
   */
  constructor ({cache, query}) {
    this.cache = cache
    this.table = query.table
    this.query = query
    this.name = query.table + '_' + (new Date()).toISOString()
  }

  /**
   * creates a report based on the instantiation options
   *
   * @returns report
   */
  async generate () {
    const report = await this.cache.query(this.table, this.query.query)
    this.data = report
    return report
  }
}

module.exports = Report
