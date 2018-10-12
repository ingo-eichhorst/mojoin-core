'use strict'

// const schedule = require('node-schedule')
const GenerateSchema = require('generate-schema')
const validate = require('./datasource.validate')

// TODO: Test if the datasource can be reached
// TODO: schedule for permanent updating of datasource
// TODO: support multiple transporters (e.g. for )

/**
 * Base Datasource - contains all the methods that can be joiently used by
 * the specialized Datasources
 */
class Datasource {
  /**
   * Datasource constructor
   *
   * @constructor
   * @param {string} options
   * @param {string} options.name - name of the datasource
   * @param {string} options.type
   * @param {object} options.cache
   * @param {string} options.location
   * @param {string} options.idField
   * @param {string} options.privateSshKey
   */
  constructor ({ name, type, cache, location, idField, privateSshKey }) {
    validate({ name, type, cache, location })
    this.cache = cache
    this.name = name
    this.type = type
    this.location = location
    this.privateSshKey = privateSshKey
    // TODO: improve id field gatrhering on init() whidth the gathered schema
    this.idField = idField || 'id'
    this.lastStatusUpdate = new Date()
  }

  /**
   * initializes the datasource by performing setup tasks
   *
   * @returns instanziated Datasource
   */
  async init () {
    this.schema = await this.autoGenerateSchema()
    return this
  }

  /**
   * automatically generates a json schema based on the remotes datasource data
   * (this may take a while and will be skipped if already available)
   *
   * @returns {object} jsonSchema
   */
  async autoGenerateSchema () {
    // console.log(this.type, this.name)
    const data = await this.queryDatasource()
    const allFieldsExample = data.reduce((agg, curr) => {
      return Object.assign(agg, curr)
    }, {})
    const schema = GenerateSchema.json(this.name, allFieldsExample)
    return schema
  }

  // /**
  //  * TODO
  //  */
  // setRecurringSync () {
  //   // TODO: implement and use
  //   this.recurringSync = schedule.scheduleJob('*/5 * * * * *', () => {
  //     console.log('Sync:', this.name, new Date())
  //     this.syncDatasource({})
  //       .then(r => console.log(r))
  //       .catch(e => console.error(e))
  //   })
  // }

  /**
   * Queries a datasource
   */
  async queryDatasource () {
    throw new Error('Query datasource not implemented for: ' + this.type)
  }

  /**
   * Queries the datasource and saves the current state in the cache
   *
   * @param {object} TODO: specify
   * @returns {object} syncResult
   */
  async syncDatasource ({ modified, limit } = {}) {
    // console.log(`Syncing ${this.name} ...`)
    const started = new Date()

    const Table = await this.cache.upsertTable(
      this.name,
      this.schema,
      this.idField
    )

    // TODO: handle partial sync if modified field is defined
    if (modified) {
    }

    let resultLength = 0
    let offset = 0
    const result = []
    do {
      const page = await this.queryDatasource({ limit, offset })
      result.push(...page)
      await this.cache.upsertRows({
        idField: this.idField,
        rows: result,
        Table
      })
      resultLength = limit ? result.length : 0
      offset++
    } while (resultLength > 0)

    // console.log('... sync finished')

    const finished = new Date()
    return {
      started,
      finished,
      syncedEntities: result.length
    }
  }
}

module.exports = Datasource
