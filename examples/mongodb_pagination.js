const Mojoin = require('../lib/index.js')

const mojoin = new Mojoin([
  {
    name: 'albums',
    type: 'mongodb',
    location: 'mongodb://localhost:27017/albumdb/albums',
    paginationPageSize: 4 // optional - defaults to 100
  }
])

const query = {
  table: 'albums',
  where: {
    userId: 2
  }
}

mojoin
  .syncAll()
  .then(() => mojoin.generateReport(query))
  .then(r => console.log(r))
  .catch(e => console.error(e))
