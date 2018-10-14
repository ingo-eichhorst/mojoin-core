const Koa = require('koa')
const app = (module.exports = new Koa())
const Mojoin = require('../lib/index.js')

const path = require('path')
const todos = path.join(__dirname, './datasource/todos.json')

/**
 * Simple Webserver
 */
app.use(async function (ctx) {
  ctx.body = todos.slice(ctx.query.offset, ctx.query.limit)
})

app.listen(12987)

/**
 * Mojoin datasource from webserver
 */

const mojoin = new Mojoin([
  {
    name: 'todos',
    type: 'rest',
    location: 'https://localhost:12987/todos',
    paginationPageSize: 2, // defaults to 20
    paginationLimitParam: 'limit', // needed for html
    paginationOffsetParam: 'offset', // needed for html
    paginationPlacement: 'query' // needed for html
  }
])

const query = {
  table: 'users',
  where: {
    userId: 2
  }
}

mojoin
  .syncAll()
  .then(() => mojoin.generateReport(query))
  .then(r => console.log(r))
  .catch(e => console.error(e))
