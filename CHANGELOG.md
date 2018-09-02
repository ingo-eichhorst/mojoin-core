# Changelog

## Roadmap

- [ ] encrypt cache
- [ ] Multi-Tenancy
- [ ] rewrite in typescript
- [ ] Benchmark tests
- [ ] Time-Series Reports
- [ ] Security: Detect SQL injection attacts and prevent
- [ ] datasource Support SQL databases with (sequalize)
- [ ] Initializing the cache includes synchronous creation of folder if not exists --> this should be asynchronous

## Version 0.1.0 - 2018-xx-xx

- [ ] resolve all the TODOs in the code
- [ ] implement recurring sync
- [ ] logging library --> debug or winston or whatever
- [ ] CodeImprovement: functions take only a object as input
- [ ] make horizontal scaling possible by external queue
- [ ] Threading for long running/ blocking worker processes e.g. Treat syncing processes as task with a certain progress
- [ ] Only update changed data in the cache (by modification date)
- [ ] Datasource query pagination
- [ ] sync all included datasources before query by default
- [ ] input validation for all methods/ functions
- [ ] improve the jsdoc comments so that a jsdoc wesite report looks good
- [ ] resolve all teh CodeClimate issues

## Version 0.0.5 - 2018-xx-xx

- [ ] Export Reports as CSV, JSON or XLS
- [ ] Improve error handling
- [ ] MongoDB connection via ssh
- [x] add >90% unit and integration tests
- [x] Use Strict everywhere

## Version 0.0.4 - 2018-08-24

- [x] JSDocs
- [x] Builds on PR - CiercleCi
- [x] Code Quality checks - codacy
- [x] Vulnarability checks - snyk

## Version 0.0.3 - 2018-08-23

- [x] Disable verbose logging
- [x] added unit test structure
- [x] simplified query structure

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
