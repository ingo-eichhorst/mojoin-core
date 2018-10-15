const Mojoin = require('../lib/index.js')

const mojoin = new Mojoin([
  {
    name: 'titles',
    type: 'mongodb',
    location: 'mongodb://localhost:27017/title-manager/titles',
    idField: 'uuid',
    paginationPageSize: 4 // optional - defaults to 100
  }
])

const query = {
  table: 'titles',
  where: {
    originalTitle: 'Die Trying'
  }
}

mojoin
  .syncAll()
  .then(() => mojoin.generateReport(query))
  .then(r => console.log(r))
  .catch(e => console.error(e))
