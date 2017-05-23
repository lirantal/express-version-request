# express-version-request

[![view on npm](http://img.shields.io/npm/v/express-version-request.svg)](https://www.npmjs.org/package/express-version-request)
[![view on npm](http://img.shields.io/npm/l/express-version-request.svg)](https://www.npmjs.org/package/express-version-request)
[![npm module downloads](http://img.shields.io/npm/dt/express-version-request.svg)](https://www.npmjs.org/package/express-version-request)
[![Dependency Status](https://david-dm.org/lirantal/express-version-request.svg)](https://david-dm.org/lirantal/express-version-request)

## What is this?

This npm package provides an ExpressJS middleware that sets the request object with a `version` property by parsing a request HTTP header.  

## Usage

### Set request version statically

If you wish to employ your own logic in some middleware/configuration and set the request version programmaticaly and not by parsing a specific HTTP header:

```js
const versionRequest = require('express-version-request')

app.use(versionRequest.setVersion('1.2.3'))
```

Then in later middlewares you will be able to access `req.version` property and it's value set to 1.2.3.

### Set request version by HTTP header

By default, the library will parse the version out of the `X-Api-Version` HTTP header:

```js
const versionRequest = require('express-version-request')

app.use(versionRequest.setVersionByHeader())
```

### Set request version by custom HTTP header

If you wish to advise the library which HTTP header to parse to extract the version:

```js
const versionRequest = require('express-version-request')

app.use(versionRequest.setVersionByHeader('My-HTTP-Header-Name'))
```

### Set request version by HTTP query parameter

By default, the library will parse the version out of the `api-version` query parameter:

```js
const versionRequest = require('express-version-request')

app.use(versionRequest.setVersionByQueryParam())
```

### Set request version by custom HTTP query parameter

If you wish to advise the library which query parameter to parse to extract the version:

```js
const versionRequest = require('express-version-request')

app.use(versionRequest.setVersionByQueryParam('myQueryParam'))
```
#### Delete version HTTP query parameter after setting the request object with a `version` property

`setVersionByQueryParam` has a second parameter (false by default) that indicates whether the HTTP query parameter should be deleted after 
setting the request object with a `version` property.

`setVersionByQueryParam (queryParam, removeQueryParam = false)`

If you define a middleware after versionRequest then you can verify that the version is indeed set:

```js
app.use((req, res, next) => {
    console.log(req.version)
    next()
  })
```

## Installation

```bash
yarn add express-version-request
```

## Tests

```bash
yarn test
```

Project linting:

```bash
yarn lint
```

## Coverage

```bash
yarn test:coverage
```

## Commit

The project uses the commitizen tool for standardizing changelog style commit
messages so you should follow it as so:

```bash
git add .           # add files to staging
yarn commit      # use the wizard for the commit message
```

## Author

Liran Tal <liran.tal@gmail.com>
