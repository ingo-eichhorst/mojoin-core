'use strict'

const debug = require('debug')

/**
 * Report that contains the cache query result and additional metadata
 * regarding the query. A report can be exported in different formats.
 */
class Report {
  /**
   * Report constructor
   *
   * @param {object} options
   * @param {object} options.datasources - array of all datasources
   * @param {object} options.cache - cache instance to query
   * @param {object} options.query - query that should be performed on the cache
   */
  constructor ({ datasources, cache, query }) {
    this.cache = cache
    this.query = query
    this.datasources = datasources
    this.name = query.table + '_' + new Date().toISOString()
  }

  /**
   * Syncronises all datasources that are involved in the current query
   *
   * @returns {boolean} successful = true - or throws an error
   */
  async syncInvolvedDatasources () {
    const datasourcesInQuery = []
    if (this.query.include) {
      datasourcesInQuery.push(this.query.include
        .reduce((agg, source) => {
          agg.push(source.model)
          return agg
        }, []))
    }
    datasourcesInQuery.push(this.query.table)
    const filteredDatasources = this.datasources.filter(source => {
      if (datasourcesInQuery.includes(source.name)) return source
    })
    for (let i = 0; i < filteredDatasources.length; i++) {
      try {
        await filteredDatasources[i].init()
        const result = await filteredDatasources[i].syncDatasource()
        debug('syncing datasources %s before query: %j', filteredDatasources[i].name, result)
      } catch (e) {
        debug('error syncing datasources: %s', e.message)
        throw e
      }
    }
    return true
  }

  /**
   * Creates a report based on the instantiation options
   *
   * @param {object} options
   * @param {boolean} options.sync - syncs all involved datasources before querying
   * @returns {array} report
   */
  async generate ({ sync = true } = {}) {
    try {
      if (sync) await this.syncInvolvedDatasources()
      const report = await this.cache.query(this.query)
      this.data = report
      return report
    } catch (e) {
      debug('Error generating the report: %s', e.message)
      throw e
    }
  }
}

module.exports = Report
