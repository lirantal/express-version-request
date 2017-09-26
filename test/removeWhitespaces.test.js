'use strict'

const test = require('ava')
const versionRequest = require('../index')

test('it removes whitespaces from a string', t => {
  t.is(versionRequest.removeWhitespaces('a  '), 'a')
})

test('it returns the same string if nothing to remove', t => {
  t.is(versionRequest.removeWhitespaces('a'), 'a')
})

test('it returns empty string if given object', t => {
  t.is(versionRequest.removeWhitespaces({}), '')
})

test('it returns empty string if given number', t => {
  t.is(versionRequest.removeWhitespaces(42), '')
})

test('it returns empty string if given array', t => {
  t.is(versionRequest.removeWhitespaces(['a', 'b']), '')
})
