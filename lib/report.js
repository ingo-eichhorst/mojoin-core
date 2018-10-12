'use strict'

/**
 * Report that contains the cache query result and additional metadata
 * regarding the query. A report can be exported in different formats.
 */
class Report {
  /**
   * Report constructor
   *
   * @param {object} options
   * @param {object} options.cache - cache instance to query
   * @param {object} options.query - query that should be performed on the cache
   */
  constructor ({ cache, query }) {
    this.cache = cache
    this.query = query
    this.name = query.table + '_' + new Date().toISOString()
  }

  /**
   * creates a report based on the instantiation options
   *
   * @returns report
   */
  async generate () {
    const report = await this.cache.query(this.query)
    this.data = report
    return report
  }
}

module.exports = Report
