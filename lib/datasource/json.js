'use strict'

const { promisify } = require('util')
const { readFile } = require('fs')
const debug = require('debug')('mojoin:Json')

const Datasource = require('./datasource')

/**
 * Json file - Datasource
 */
class Json extends Datasource {
  /**
   * reads a json file
   *
   * @returns {array} json - content as js array
   */
  async queryDatasource () {
    const readFilePromise = promisify(readFile)
    try {
      const fileContent = await readFilePromise(this.location, 'utf8')
      return JSON.parse(fileContent)
    } catch (e) {
      debug('Error reading json file %s: %s', this.location, e.message)
      throw e
    }
  }
}

module.exports = Json
