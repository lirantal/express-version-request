'use strict'

const test = require('ava')
const versionRequest = require('../index')

test.beforeEach(t => {
  t.context.req = {
    headers: {}
  }
})

test('we can set the version using the Accept header version field', t => {
  const versionNumber = '1.0.0'

  t.context.req.headers['accept'] = 'application/vnd.company+json;version=' + versionNumber
  const middleware = versionRequest.setVersionByAcceptHeader()

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, versionNumber)
  })
})

test('we can set the version using the Accept header version field, even if we have multiple parameters', t => {
  const versionNumber = '1.0.0'

  t.context.req.headers['accept'] = 'application/vnd.company+json;param1=1,version=' + versionNumber + ', param3=3'
  const middleware = versionRequest.setVersionByAcceptHeader()

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, versionNumber)
  })
})

test('we can set the version using the Accept header version field, even if it has funky whitespaces', t => {
  const versionNumber = '1.0.0'

  t.context.req.headers['accept'] = 'application/vnd.company+json; param1=1,      version =' + versionNumber + '  , param3=3'
  const middleware = versionRequest.setVersionByAcceptHeader()

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, versionNumber)
  })
})

test('we can set the version using the Accept header version field, even if it mixes lower- and uppercase characters', t => {
  const versionNumber = '1.0.0'

  t.context.req.headers['accept'] = 'application/vnd.company+json; param1=1,      Version =' + versionNumber + '  , param3=3'
  const middleware = versionRequest.setVersionByAcceptHeader()

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, versionRequest.formatVersion(versionNumber))
  })
})

test('dont set the version if the Accept header has no "version" parameter', t => {
  t.context.req.headers['accept'] = 'application/vnd.company+json;param1=1, param2=2'
  const middleware = versionRequest.setVersionByAcceptHeader()

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, undefined)
  })
})

test('dont set the version if the Accept header has no parameters at all', t => {
  t.context.req.headers['accept'] = 'application/vnd.company+json;'
  const middleware = versionRequest.setVersionByAcceptHeader()

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, undefined)
  })
})

test('dont set the version if the Accept header has no parameters at all (without ending ;)', t => {
  t.context.req.headers['accept'] = 'application/vnd.company+json'
  const middleware = versionRequest.setVersionByAcceptHeader()

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, undefined)
  })
})

//  Alternative format

test('we can set the version using the Accept header alternative format', t => {
  const versionNumber = '1.0.0'

  t.context.req.headers['accept'] = 'application/vnd.company-v' + versionNumber + '+json'
  const middleware = versionRequest.setVersionByAcceptHeader()

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, versionNumber)
  })
})

test('we can set the version using the Accept header alternative format, even if it has whitespaces', t => {
  const versionNumber = '1.0.0'

  const headers = { accept: 'application/ vnd.company -v' + versionNumber + ' + json' }
  const resultingVersion = versionRequest.setVersionByAcceptFormat(headers)

  t.deepEqual(resultingVersion, versionNumber)
})

test('dont set the version, if the alternative format is incorrect', t => {
  const headers = { accept: 'application/ vnd.company -v1.0.0///json' }
  const resultingVersion = versionRequest.setVersionByAcceptFormat(headers)

  t.deepEqual(resultingVersion, undefined)
})

//  Custom function

test('we can set the version using a custom function to parse the Accept header', t => {
  const versionNumber = '1.0.0'

  t.context.req.headers['accept'] = versionNumber
  const middleware = versionRequest.setVersionByAcceptHeader(v => v)

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, versionNumber)
  })
})

test('we can handle, if the custom function returns a number', t => {
  const versionNumber = '1.1'

  t.context.req.headers['accept'] = versionNumber
  const middleware = versionRequest.setVersionByAcceptHeader(v => parseFloat(v))

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, versionRequest.formatVersion(versionNumber))
  })
})

test('we can handle, if the custom function returns a boolean', t => {
  const versionNumber = true

  t.context.req.headers['accept'] = versionNumber
  const middleware = versionRequest.setVersionByAcceptHeader(v => versionNumber)

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, undefined)
  })
})

test('we can handle, if the custom function returns an object', t => {
  const versionNumber = {alpha: true}
  t.context.req.headers['accept'] = 1
  const middleware = versionRequest.setVersionByAcceptHeader(v => { return versionNumber })

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, JSON.stringify(versionNumber))
  })
})
