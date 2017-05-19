'use strict'

const test = require('ava')
const versionRequest = require('../index')

test.beforeEach(t => {
  t.context.req = {
    query: {}
  }
})

test('dont set a version if req object is not well composed: req is null', t => {
  t.context.req = null
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req, null)
    t.throws(function () {
      t.context.req.version
    })
  })
})

test('dont set a version if req object is not well composed: req is undefined', t => {
  t.context.req = undefined
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req, undefined)
    t.throws(function () {
      t.context.req.version
    })
  })
})

test('dont set a version if req object is not well composed: req.query is undefined', t => {
  const versionNumber = 1
  t.context.req.query = undefined
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.query, undefined)
    t.not(t.context.req.version, versionNumber)
  })
})

test('dont set a version if no version query is set', t => {
  const versionNumber = false

  t.context.req.query = {}
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.not(t.context.req.version, versionNumber)
  })
})

test('we can set a version on the request object by request query parameters', t => {
  const versionNumber = 1

  t.context.req.query['api-version'] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
  })
})


test('we can manually set a specific version to be string', t => {
  const versionNumber = '1'

  t.context.req.query['api-version'] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
  })
})

test('we can manually set a specific version to be object', t => {
  const versionNumber = { myVersion: 'alpha' }

  t.context.req.query['api-version'] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.not(t.context.req.version, versionNumber)
  })
})

test('we can set a version on the request object by specifying custom http query param as integer', t => {
  const versionNumber = 1
  const versionParamName = 'my-api-version-param'

  t.context.req.query[versionParamName] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam(versionParamName)

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
  })
})

test('we can set a version on the request object by specifying custom http query param as string', t => {
  const versionNumber = '1'
  const versionParamName = 'my-api-version-param'

  t.context.req.query[versionParamName] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam(versionParamName)

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
  })
})

test('do not allow to set a version on the request object by specifying custom http query param by object', t => {
  const versionNumber = { myVersion: 'alpha' }
  const versionParamName = 'my-api-version-param'

  t.context.req.query[versionParamName] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam(versionParamName)

  middleware(t.context.req, {}, () => {
    t.not(t.context.req.version, versionNumber)
  })
})
