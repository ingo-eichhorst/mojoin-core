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
    return {
      stdout: '[]'
    }
  }
}
