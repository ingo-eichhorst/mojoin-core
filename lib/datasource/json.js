const Datasource = require('./datasource')
const { promisify } = require('util')
const { readFile } = require('fs')

class Json extends Datasource {
  async queryDatasource () {
    const readFilePromise = promisify(readFile)
    const fileContent = await readFilePromise(this.location, 'utf8')
    const json = JSON.parse(fileContent)
    return json
  }
}

module.exports = Json
