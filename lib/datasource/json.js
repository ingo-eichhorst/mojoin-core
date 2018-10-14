'use strict'

const { promisify } = require('util')
const { readFile, stat } = require('fs')
const readFilePromise = promisify(readFile)
const fileStatPromise = promisify(stat)

const debug = require('debug')('mojoin:Json')

const Datasource = require('./datasource')

/**
 * Json file - Datasource
 */
class Json extends Datasource {
  /**
   * reads a json file
   *
   * @param {object} options
   * @param {date} options.modifiedAfter
   * @returns {array} json - content as js array
   */
  async queryDatasource ({ modifiedAfter } = {}) {
    try {
      if (
        modifiedAfter &&
        (await fileStatPromise(this.location)).mtime <= modifiedAfter
      ) return []

      const fileContent = await readFilePromise(this.location, 'utf8')
      return JSON.parse(fileContent)
    } catch (e) {
      debug('Error reading json file %s: %s', this.location, e.message)
      throw e
    }
  }
}

module.exports = Json
