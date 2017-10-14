'use strict'

const test = require('ava')
const versionRequest = require('../index')
const sinon = require('sinon')

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
      return t.context.req.version
    })
  })
})

test('dont set a version if req object is not well composed: req is undefined', t => {
  t.context.req = undefined
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req, undefined)
    t.throws(function () {
      return t.context.req.version
    })
  })
})

test('dont set a version if req object is not well composed: req.query is undefined', t => {
  t.context.req.query = undefined
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.query, undefined)
    t.is(t.context.req.version, undefined)
  })
})

test('dont set a version if no version query is set', t => {
  t.context.req.query = {}
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, undefined)
  })
})

test('we can set a version on the request object by request query parameters', t => {
  const versionNumber = '1.0.0'

  t.context.req.query['api-version'] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam()

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
  })
})

test('we can manually set a specific version to be string', t => {
  const versionNumber = '1.0.0'

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
    t.is(t.context.req.version, JSON.stringify(versionNumber))
  })
})

test('we can set a version on the request object by specifying custom http query param as integer', t => {
  const versionNumber = 1
  const versionParamName = 'my-api-version-param'
  const versionRequestSpy = sinon.spy(versionRequest, 'formatVersion')

  t.context.req.query[versionParamName] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam(versionParamName)

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber + '.0.0')
    t.is(versionRequestSpy.called, true)
  })
  versionRequestSpy.restore()
})

test('we can set a version on the request object by specifying custom http query param as string', t => {
  const versionNumber = '1.0.0'
  const versionParamName = 'my-api-version-param'

  t.context.req.query[versionParamName] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam(versionParamName)

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
  })
})

test('we can set a version on the request object by specifying custom http query param by object', t => {
  const versionNumber = { myVersion: 'alpha' }
  const versionParamName = 'my-api-version-param'

  t.context.req.query[versionParamName] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam(versionParamName)

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, JSON.stringify(versionNumber))
  })
})

test('custom query param should be deleted from req.query after handling it', t => {
  const versionNumber = '1.0.0'
  const versionParamName = 'my-api-version-param'
  const options = {removeQueryParam: true}

  t.context.req.query[versionParamName] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam(versionParamName, options)

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
    t.falsy(t.context.req.query.hasOwnProperty(versionParamName))
  })
})

test('default query param should be deleted from req.query after handling it', t => {
  const versionNumber = '1.0.0'
  const options = {removeQueryParam: true}

  t.context.req.query['api-version'] = versionNumber
  const middleware = versionRequest.setVersionByQueryParam(null, options)

  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber)
    t.falsy(t.context.req.query.hasOwnProperty('api-version'))
  })
})
