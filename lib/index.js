'use strict'

const path = require('path')

const Datasource = require('./datasource')
const Cache = require('./cache')
const Report = require('./report')

class Mojoin {
  constructor (config) {
    if (Array.isArray(config)) config.datasourceConfigs = config

    const cacheConfig = config.cacheConfig || {
      type: 'sqlite',
      location: path.join(__dirname, '../db/cache.db')
    }
    this.cache = new Cache(cacheConfig)

    this.datasources = []
    config.datasourceConfigs.forEach(config => this.addDatasource(config))
  }

  addDatasource (datasource) {
    datasource.cache = this.cache
    this.datasources.push(Datasource(datasource))
  }

  async syncAll () {
    let syncResults = []
    for (let i = 0; i < this.datasources.length; i++) {
      await this.datasources[i].init()
      const result = await this.datasources[i].syncDatasource()
      syncResults.push(result)
    }
    return syncResults
  }

  async generateReport (query) {
    const report = new Report({cache: this.cache, query})
    const result = await report.generate()
    return result
  }
}

module.exports = Mojoin
