# Changelog

## Roadmap

- [ ] encrypt cache
- [ ] Multi-Tenancy
- [ ] Datasource query pagination
- [ ] MongoDB connection via ssh
- [ ] rewrite in typescript
- [ ] Benchmark tests
- [ ] Time-Series Reports
- [ ] Security: Detect SQL injection attacts and prevent
- [ ] Only update changed data in the cache (by modification date)
- [ ] Code Quality checks
- [ ] Vulnarability checks - npm audit / snyc
- [ ] Threading for long running/ blocking worker processes
- [ ] Use Strict everywhere
- [ ] datasource Support SQL databases with (sequalize)
- [ ] Export Reports an CSV, JSON or XLS
- [ ] CodeImprovement: functions take only a object as input
- [ ] Cache database to cache the last result in SQL database
- [ ] Unit/ integration tests
- [ ] Disable verbose logging
- [ ] JSDocs
- [ ] Improve error handling
- [ ] Initializing the cache includes synchronous creation of folder if not exists --> this should be asynchronous
- [ ] Treat syncing processes as task with a certain progress

## Version 0.0.2 - 2018-08-22

- [x] automatically create cache db and folder if not exists

## Version 0.0.1 - 2018-08-22

- [x] Caching of datasources
- [x] query and perform joins on cached data
- [x] Datasource configuration
- [x] Multiple supported datasources
  - [x] MongoDB
  - [x] REST API
  - [x] Json File
- [x] automatically generate schema based on a dataset
- [x] Example
- [x] Readme

Mojoin-Server

- [ ] e2e Tests
- [ ] nest.js framework
- [ ] bootstrap phase to ramp up all dependencies or throw errors
- [ ] Save datasources, queries and generated reports in database
- [ ] Simple UI (for datasource, queries, ...) in VueJS
- [ ] Simple User Management
- [ ] DotEnv for configuration
- [ ] Dockerize

Mojoin-Desktop

- [ ] e2e Tests
- [ ] Electron App that implements Mojoin-Core
