const Datasource = require('./datasource')
const { promisify } = require('util')
const { readFile } = require('fs')

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
    const fileContent = await readFilePromise(this.location, 'utf8')
    const json = JSON.parse(fileContent)
    return json
  }
}

module.exports = Json
