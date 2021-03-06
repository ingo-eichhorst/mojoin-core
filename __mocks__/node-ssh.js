module.exports = class NodeSsh {
  /**
   * connect mock
   */
  connect () {
    return {
      connection: {
        config: {
          host: 'test'
        }
      }
    }
  }

  /**
   * execCommand mock
   */
  execCommand (command) {
    let result

    if (command.includes('connection-error')) {
      result = { stderr: 'Error occured' }
    } else if (command.includes('.limit(1)')) {
      if (command.includes('.skip(0)')) {
        result = { stdout: '[{"id": 1}]' }
      } else if (command.includes('.skip(1)')) {
        result = { stdout: '[{"id": 2}]' }
      } else result = { stdout: '[]' }
    } else if (
      command.includes('.find({"modifiedAt":{"$gt":{"$date":1514808000000}}}')
    ) {
      result = { stdout: '[{"id": 3}, {"id": 4}]' }
    } else {
      result = { stdout: '[{"id": 1}, {"id": 2}]' }
    }

    return result
  }
}
