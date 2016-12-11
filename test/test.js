'use strict'

const assert = require('better-assert')
const describe = require('mocha').describe
const it = require('mocha').it
// const afterEach = require('mocha').afterEach
// const beforeEach = require('mocha').beforeEach
// const before = require('mocha').before
// const after = require('mocha').after
// const path = require('path')
// const sinon = require('sinon')

const lib = require('..')
const Parser = lib.Parser

describe('env-file-parser', function () {
  describe('Next', function () {
    it('should move the cursor ahead 1 spot', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      assert(p.cursor === 0)
    })

    it('should return true if valid cursor', function () {
      const p = new Parser('Thanks for all the fish!')
      assert(p.Next() === true)
    })

    it('should return false if invalid cursor', function () {
      const p = new Parser('')
      assert(p.Next() === false)
    })

    it('should update the current symbol to match the cursor', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      assert(p.symbol === 'T')
      p.Next()
      p.Next()
      assert(p.symbol === 'a')
    })
  })

  describe('Back', function () {
    it('should move the cursor back 1 spot', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      p.Next()
      p.Back()
      assert(p.cursor === 0)
    })

    it('should return true if valid cursor', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      p.Next()
      assert(p.Back() === true)
    })

    it('should return false if invalid cursor', function () {
      const p = new Parser('')
      p.Next()
      assert(p.Back() === false)
    })

    it('should update the current symbol to match the cursor', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      p.Next()
      p.Back()
      assert(p.symbol === 'T')
      p.Next()
      p.Next()
      p.Back()
      assert(p.symbol === 'h')
    })
  })

  describe('Peek', function () {
    it('should return the next symbol', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      assert(p.Peek() === 'h')
    })

    it('should return null if next symbol is invalid', function () {
      const p = new Parser('T')
      p.Next()
      assert(p.Peek() === null)
    })

    it('should not change cursor position', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      assert(p.cursor === 0)
      assert(p.Peek() === 'h')
      assert(p.cursor === 0)
    })
  })

  describe('LookBack', function () {
    it('should return the previous symbol', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      p.Next()
      p.Next()
      assert(p.LookBack() === 'h')
    })

    it('should return null if previous symbol is invalid', function () {
      const p = new Parser('T')
      p.Next()
      assert(p.LookBack() === null)
    })

    it('should not change cursor position', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      p.Next()
      assert(p.cursor === 1)
      assert(p.LookBack() === 'T')
      assert(p.cursor === 1)
    })
  })

  describe('Term', function () {
    it('should return true when current symbol is the arg', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      assert(p.Term('T') === true)
      p.Next()
      p.Next()
      assert(p.Term('a') === true)
    })

    it('should return false when current symbol is the not the arg', function () {
      const p = new Parser('Thanks for all the fish!')
      p.Next()
      assert(p.Term('w') === false)
      assert(p.Term('@') === false)
    })
  })
})
