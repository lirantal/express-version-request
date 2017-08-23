'use strict'

const test = require('ava')
const versionRequest = require('../index')

test.beforeEach(t => {
  t.context.req = {
    headers: {
      'x-timestamp': Date.now()
    }
  }
})

test('dont set a version if req object is not well composed: req is null', t => {
  t.context.req = null
  const middleware = versionRequest.setVersionByHeader()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req, null)
    t.throws(function () {
      t.context.req.version
    })
  })
})

test('dont set a version if req object is not well composed: req is undefined', t => {
  t.context.req = undefined
  const middleware = versionRequest.setVersionByHeader()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req, undefined)
    t.throws(function () {
      t.context.req.version
    })
  })
})

test('dont set a version if req object is not well composed: req.headers is undefined', t => {
  const versionNumber = 1

  t.context.req.headers = undefined
  const middleware = versionRequest.setVersionByHeader()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.headers, undefined)
    t.not(t.context.req.version, versionNumber)
  })
})

test('dont set a version if no version header is set', t => {
  const versionNumber = false

  t.context.req.headers = {}
  const middleware = versionRequest.setVersionByHeader()

  middleware(t.context.req, {}, () => {
    t.not(t.context.req.version, versionNumber)
  })
})

test('we can set a version on the request object by request headers', t => {
  const versionNumber = 1

  t.context.req.headers['x-api-version'] = versionNumber
  const middleware = versionRequest.setVersionByHeader()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
  })
})

test('we can manually set a specific version to be string', t => {
  const versionNumber = '1'

  t.context.req.headers['x-api-version'] = versionNumber
  const middleware = versionRequest.setVersionByHeader()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
  })
})

test('we can manually set a specific version to be object', t => {
  const versionNumber = { myVersion: 'alpha' }

  t.context.req.headers['x-api-version'] = versionNumber
  const middleware = versionRequest.setVersionByHeader()

  middleware(t.context.req, {}, () => {
    t.not(t.context.req.version, versionNumber)
  })
})

test('we can set a version on the request object by specifying custom http header as integer', t => {
  const versionNumber = 1
  const versionHeaderName = 'my-api-version-header'

  t.context.req.headers[versionHeaderName] = versionNumber
  const middleware = versionRequest.setVersionByHeader(versionHeaderName)

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
  })
})

test('we can set a version on the request object by specifying custom http header as string', t => {
  const versionNumber = '1'
  const versionHeaderName = 'my-api-version-header'

  t.context.req.headers[versionHeaderName] = versionNumber
  const middleware = versionRequest.setVersionByHeader(versionHeaderName)

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
  })
})

test('do not allow to set a version on the request object by specifying custom http header by object', t => {
  const versionNumber = { myVersion: 'alpha' }
  const versionHeaderName = 'my-api-version-header'

  t.context.req.headers[versionHeaderName] = versionNumber
  const middleware = versionRequest.setVersionByHeader(versionHeaderName)

  middleware(t.context.req, {}, () => {
    t.not(t.context.req.version, versionNumber)
  })
})
