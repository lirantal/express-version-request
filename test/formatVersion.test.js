'use strict'

const test = require('ava')
const versionRequest = require('../index')

test('it pads a shorter version with two zeros', t => {
  t.is(versionRequest.formatVersion('2'), '2.0.0')
})

test('it pads a shorter version with one zero', t => {
  t.is(versionRequest.formatVersion('2.2'), '2.2.0')
})

test('it doesnt change the version, if its correctly formatted', t => {
  t.is(versionRequest.formatVersion('2.2.0'), '2.2.0')
})

test('it converts and corrects the version, if the input is a number', t => {
  t.is(versionRequest.formatVersion(1), '1.0.0')
  t.is(versionRequest.formatVersion(1.2), '1.2.0')
})

test('it shold truncate the version if its longer than it should be', t => {
  t.is(versionRequest.formatVersion('1.0.0.0.0.0.1'), '1.0.0')
  t.is(versionRequest.formatVersion('1.0.1.1.0.0.1'), '1.0.1')
})

test('it returns undefined, if the input cant be converted into a correct version', t => {
  t.is(versionRequest.formatVersion(undefined), undefined)
  t.is(versionRequest.formatVersion(null), undefined)
  t.is(versionRequest.formatVersion(''), undefined)
  t.is(versionRequest.formatVersion(0), undefined)
  t.is(versionRequest.formatVersion(() => {}), undefined)
})
