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
    if (command.includes('connection-error')) {
      return {
        stderr: 'Error occured'
      }
    }

    console.log(command)

    if (command.includes('.limit(1)')) {
      if (command.includes('.skip(0)')) {
        return { stdout: '[{"id": 1}]' }
      } else if (command.includes('.skip(1)')) {
        return { stdout: '[{"id": 2}]' }
      } else return { stdout: '[]' }
    }

    return {
      stdout: '[{"id": 1}, {"id": 2}]'
    }
  }
}
