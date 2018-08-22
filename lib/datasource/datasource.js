'use strict'

const schedule = require('node-schedule')
const GenerateSchema = require('generate-schema')

// TODO: Test if the datasource can be reached
// TODO: schedule for permanent updating of datasource
// TODO: support multiple transporters (e.g. for )

class Datasource {
  constructor ({name, type, cache, location, idField}) {
    this.cache = cache
    this.name = name || type
    this.type = type
    this.location = location
    this.idField = idField || 'id'
    this.lastStatusUpdate = new Date()
  }

  async init () {
    this.schema = await this.autoGenerateSchema()
    return this
  }

  async autoGenerateSchema () {
    const data = await this.queryDatasource()
    const schema = GenerateSchema.json(this.name, data[0])
    return schema
  }

  setRecurringSync () {
    this.recurringSync = schedule.scheduleJob('*/5 * * * * *', () => {
      console.log('Sync:', this.name, new Date())
      this.syncDatasource({}).then(r => console.log(r)).catch(e => console.error(e))
    })
  }

  async queryDatasource () {
    throw new Error('Query datasource not implemented for:', this.type)
  }

  /**
   * @returns {object} syncResult
   */
  async syncDatasource ({modified, limit} = {}) {
    console.log(`Syncing ${this.name} ...`)
    const started = new Date()

    const Table = await this.cache.upsertTable(this.name, this.schema, this.idField)

    // TODO: handle partial sync if modified field is defined
    if (modified) {
    }

    let resultLength = 0
    let offset = 0
    const result = []
    do {
      const page = await this.queryDatasource({limit, offset})
      result.push(...page)
      await this.cache.upsertRows({
        idField: this.idField,
        rows: result,
        Table
      })
      resultLength = limit ? result.length : 0
      offset++
    } while (resultLength > 0)

    console.log('... sync finished')

    const finished = new Date()
    return {
      started,
      finished,
      syncedEntities: result.length
    }
  }
}

module.exports = Datasource
