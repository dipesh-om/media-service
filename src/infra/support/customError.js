module.exports = () => {
    class CustomError extends Error {
      constructor (code = 'GENERIC', status = 500, message = '', messageI18n = '', data = {}, ...params) {
        super(...params)
  
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, CustomError)
        }
  
        this.code = code
        this.status = status
        this.message = message
        this.messageI18n = messageI18n
      }
    }
    return CustomError
  }
  