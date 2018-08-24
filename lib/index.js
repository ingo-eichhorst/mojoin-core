'use strict'

const path = require('path')

const Datasource = require('./datasource')
const Cache = require('./cache')
const Report = require('./report')

/**
 * Sync all kinds of datasources into a central SQL database
 * and perform queries/ joins on the gathered data
 */
class Mojoin {
  /**
   * Mojoin constructor
   *
   * @constructor
   * @param {object | array} config.datasourceConfigs
   *                         config.cacheConfig
   *                         - datasource configs only
   */
  constructor (config) {
    // TODO: input validation
    if (Array.isArray(config)) config.datasourceConfigs = config

    const cacheConfig = config.cacheConfig || {
      type: 'sqlite',
      location: path.join(__dirname, '../db/cache.db')
    }
    this.cache = new Cache(cacheConfig)

    this.datasources = []
    config.datasourceConfigs.forEach(config => this.addDatasource(config))
  }

  /**
   * adds a datasource to the Mojoion instance
   *
   * @param {object} datasource.type
   *                 datasource.location
   */
  addDatasource (datasource) {
    datasource.cache = this.cache
    this.datasources.push(Datasource(datasource))
  }

  /**
   * syncronizes all datasources with the cache
   *
   * @returns {object} - syncResults
   */
  async syncAll () {
    let syncResults = []
    for (let i = 0; i < this.datasources.length; i++) {
      await this.datasources[i].init()
      const result = await this.datasources[i].syncDatasource()
      syncResults.push(result)
    }
    return syncResults
  }

  /**
   * queries the cache and returns the result
   *
   * @param {object} query - query object (see README.md for specification)
   */
  async generateReport (query) {
    const report = new Report({cache: this.cache, query})
    const result = await report.generate()
    return result
  }
}

module.exports = Mojoin
