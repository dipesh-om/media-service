'use strict'

const cls = require('cls-hooked')

const nsid = 'a6a29a6f-6747-4b5f-b99f-07ee96e32f88'

/** Express.js middleware that is responsible for initializing the context for each request. */
function middleware (req, res, next) {
  const ns = cls.getNamespace(nsid) || cls.createNamespace(nsid)
  ns.run(() => next())
}

function sqsMiddleware (message, next) {
  const ns = cls.getNamespace(nsid) || cls.createNamespace(nsid)
  return ns.runAndReturn(() => next(message))
}

/**
 * Gets a value from the context by key.  Will return undefined if the context has not yet been initialized for this request or if a value is not found for the specified key.
 * @param {string} key
 */
function get (key) {
  const ns = cls.getNamespace(nsid)
  if (ns && ns.active) {
    return ns.get(key)
  }
}

/**
 * Adds a value to the context by key.  If the key already exists, its value will be overwritten.  No value will persist if the context has not yet been initialized.
 * @param {string} key
 * @param {*} value
 */
function set (key, value) {
  const ns = cls.getNamespace(nsid)
  if (ns && ns.active) {
    return ns.set(key, value)
  }
}

function getNs () {
  return cls.getNamespace(nsid) || cls.createNamespace(nsid)
}

module.exports = {
  sqsMiddleware,
  middleware,
  get: get,
  set: set,
  getNs
}
