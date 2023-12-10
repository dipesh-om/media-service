module.exports = () => {
  class RuntimeError extends Error {
    constructor (error) {
      super(error)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, RuntimeError)
      }

      this.error = error
    }
  }
  return RuntimeError
}
