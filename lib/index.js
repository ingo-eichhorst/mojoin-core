'use strict'

const path = require('path')
const debug = require('debug')('mojoin:Mojoin')

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
   * @param {object | array} config | datasources
   * @param {array} config.datasources - array of datasource objects
   * @param {object} config.cache - cache config object
   */
  constructor (config) {
    // TODO: input validation
    debug('start creating mojoin instance')
    let datasourceConfigs
    if (Array.isArray(config)) datasourceConfigs = config
    else datasourceConfigs = config.datasources

    const cacheConfig = config.cache || {
      type: 'sqlite',
      location: path.join(__dirname, '../db/cache.db')
    }
    this.cache = new Cache(cacheConfig)

    this.datasources = []
    datasourceConfigs.forEach(config => this.addDatasource(config))
    debug(
      'finished creating mojoin instance with cache: %s and %d datasources',
      this.cache.databaseName,
      this.datasources.length
    )
  }

  /**
   * adds a datasource to the Mojoion instance
   *
   * @param {object} datasource
   */
  addDatasource (datasource) {
    datasource.cache = this.cache
    this.datasources.push(Datasource(datasource))
    debug('added %s datasource %s', datasource.type, datasource.name)
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
    debug('finished syncing %d datasources', syncResults.length)
    return syncResults
  }

  /**
   * queries the cache and returns the result
   *
   * @param {object} query - query object (see README.md for specification)
   * @returns {object} report
   */
  async generateReport (query) {
    const report = new Report({ cache: this.cache, query })
    const result = await report.generate()
    debug('generated report with %d entries', result.length)
    return result
  }
}

module.exports = Mojoin
