'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const expect = chai.expect

const missing = require('../lib/missing-from-other-list.js')

const a = [1, 2, 3, 5, 7, 11]
const b = [0, 1, 2, 3, 5, 8, 13]

describe('missingFromOtherList', () => {
  const pair = missing(a, b, (a, b) => a > b ? 1 : a < b ? -1 : 0)
  describe('return value', function () {
    it('is defined', function () {
      expect(pair).to.be.defined
    })
  })
  describe('in a, not in b', function () {
    it('contains 7 and 11', function () {
      expect(pair[0]).to.deep.equal([7, 11])
    })
  })
  describe('in b, not in a', function () {
    it('contains 0, 8, and 13', function () {
      expect(pair[1]).to.deep.equal([0, 8, 13])
    })
  })
})
