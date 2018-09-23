const Mojoin = require('../lib/index.js')

const mojoin = new Mojoin([
  {
    name: 'mongodb',
    type: 'mongodb',
    location: 'ssh://vagrant:vagrant@talktalk-nemo-staging.nowtilus.tv/db/tasks'
  }
])

const query = {
  table: 'tasks',
  where: {
    userId: 2
  }
}

mojoin
  .syncAll()
  .then(result => {
    return mojoin.generateReport(query)
  })
  .then(r => console.log(r))
  .catch(e => console.error(e))
