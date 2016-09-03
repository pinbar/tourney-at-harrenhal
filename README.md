## A tournament bracket app
The project name is an homage to the tournament that set in motion the events of Game of Thrones (http://awoiaf.westeros.org/index.php/Tourney_at_Harrenhal)

[![CircleCI](https://img.shields.io/circleci/project/pinbar/tourney-at-harrenhal/master.svg)](https://circleci.com/gh/pinbar/tourney-at-harrenhal) [![Test Coverage](https://codeclimate.com/github/pinbar/tourney-at-harrenhal/badges/coverage.svg)](https://codeclimate.com/github/pinbar/tourney-at-harrenhal/coverage) [![Code Climate](https://codeclimate.com/github/pinbar/tourney-at-harrenhal/badges/gpa.svg)](https://codeclimate.com/github/pinbar/tourney-at-harrenhal) [![Issue Count](https://codeclimate.com/github/pinbar/tourney-at-harrenhal/badges/issue_count.svg)](https://codeclimate.com/github/pinbar/tourney-at-harrenhal)

### tech stack
* **nodejs** - javascript runtime built on v8 engine
* **express** - minimalistic web api framework for nodejs
* **body-parser** - middleware for body parsing
* **morgan** - middleware for http request/response logging
* **jsonwebtoken** - jwt implementation for nodejs
* **crypto** - cryptography module for nodejs
* **jasmine** - testing framework
* **jasmine-reporters** - test result reporters (using JUnit reporter for CircleCI)
* **istanbul** - module for test instrumentation and coverage
* **request** - module for testing end-points

### getting started
* clone repo and `npm install`
* in the project directory, run `node index.js`
* launch the browser and point to the baseurl `localhost:8081` (port can be changed in `config.js`)
* *optional:*
    * use **nodemon** to monitor for changes in your nodejs app and automatically restart the server
    * if you don't have nodemon, install it globally `npm install -g nodemon`
    * in the project directory run `nodemon`

### running tests
* tests are in the `spec` directory, which includes both `unit` and `integration` tests
* to run all the tests, run `npm test` in the project directory
* to run a single test, mark it with `fit` (use `fdescribe` to include the entire spec)
* to exclude a test, mark it with `xit` (use `xdescribe` to exclude the entire spec)
* **test coverage:** 
    * to run instrumented code and generage coverage reports, run `npm run test-with-coverage`
    * coverage reports are in `reports/coverage` directory (can be configured in `.istanbul.yml`)
* **reporter** runs a jasmine helper to produce JUnit formatted test results in `reports/junit`

### api and authentication scenarios
* all `/api/*` calls are secured with JWT authentication
* obtain a JWT token here `POST /authenticate.html`
    * enter name:password (jon:I know nothing or tyrion:I know things)
    * the response contains a JWT token for that user
* use the token when calling any secure api (`/api/*`):
    * set the `Authorization` request header and add the jwt token, like so:
    * `Authorization: Bearer \<token\>`
* `GET /api/castleblack` can be accessed with any token but `GET /api/winterfell` can only be accessed with house stark's token
* some information in the payload is encrypted for privacy

### encryption
* a part of the jwt claims/playload is encrypted before signing and then decrypted after verification for privacy
* this is different from JWE, where only the signature is encrypted while the claims/payload can be easily decoded and read