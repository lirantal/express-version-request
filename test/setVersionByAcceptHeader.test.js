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
