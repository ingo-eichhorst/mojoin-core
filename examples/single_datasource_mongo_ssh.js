const Mojoin = require('../lib/index.js')

const mojoin = new Mojoin([
  {
    name: 'medias',
    type: 'mongodb',
    location: 'ssh://vagrant:vagrant@talktalk-nemo-staging.nowtilus.tv/media-manager/media',
    idField: 'uuid'
  }
])

const query = {
  table: 'medias',
  where: {
    subType: 'poster'
  }
}

mojoin
  .syncAll()
  .then(result => {
    return mojoin.generateReport(query)
  })
  .then(r => console.log(r))
  .catch(e => console.error(e))
