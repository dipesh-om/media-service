const logger = require('./logger')
const R = require('ramda')
const httpContext = require('../httpContext/cls')

const mergeUserData = (data, meta = {}) => {
  const user = httpContext.get('currentuser')
  const recipientUser = httpContext.get('recipientUser')
  const requestId = httpContext.get('request_id')
  const messageId = httpContext.get('MessageId')
  const moduleName = httpContext.get('moduleName')
  const apiCategory = httpContext.get('apiCategory')
  const clientIp = httpContext.get('ip')
  const processId = process.pid;
  let secretHash = httpContext.get('secretHash')
  const rayId = httpContext.get('cf-ray')
  meta = R.mergeAll([meta, { request_id: requestId }])
  if (messageId && data.message) {
    data.message = `${messageId} ${data.message}`
  }
  if (user) {
    meta = R.mergeAll([meta, { user_id: user.id, userId: user.id, email : secretHash}])
  }
  if(user && user.userRoles){
    meta = R.mergeAll([meta, { roles: user.userRoles.toString()}])
  }
  if(moduleName) {
    meta = R.mergeAll([meta, { moduleName: moduleName}])
  }
  if(apiCategory) {
    meta = R.mergeAll([meta, { apiCategory: apiCategory}])
  }
  if(clientIp) {
    meta = R.mergeAll([meta, { clientIp: clientIp}])
  }
  if(processId) {
    meta = R.mergeAll([meta, { processId: processId}])
  }
  if(recipientUser) {
    meta = R.mergeAll([meta, { recipientUserId: recipientUser.recipientUserId}])
  }
  if(rayId) {
    meta = R.mergeAll([meta, { rayId: rayId}])
  }
  let logMessage = R.mergeAll([data, { meta: meta }])
  return logMessage
}
module.exports = ({ config }) => {
  const _logger = logger({ config })
  let flgSilent = false

  return {
    eventInfo: (message) => {
      !flgSilent && _logger.log({ level: 'info', message: message })
    },
    info: (message, error) => {
      if (error && error instanceof Error) {
        error.message = `${message}  ${error.message}`
        !flgSilent && _logger.log(mergeUserData({ level: 'info', message: error }))
      } else {
        !flgSilent && _logger.log(mergeUserData({ level: 'info', message }))
      }
    },
    infoMap: (messageData) => {
      !flgSilent && _logger.log(mergeUserData({ level: 'info', ...messageData }))
    },
    infoMeta: (message, meta = {}) => {
      !flgSilent && _logger.log(mergeUserData({ level: 'info', message }, meta))
    },
    debug: (message) => {
      !flgSilent && _logger.log(mergeUserData({ level: 'debug', message }))
    },
    warn: (message) => {
      !flgSilent && _logger.log(mergeUserData({ level: 'warn', message }))
    },
    error: (message, error) => {
      if (error && error instanceof Error) {
        error.message = `${message}  ${error.message}`
        !flgSilent && _logger.log(mergeUserData({ level: 'error', message: error }))
      } else {
        if (error) {
          message = message + JSON.stringify(error)
        }
        !flgSilent && _logger.log(mergeUserData({ level: 'error', message }))
      }
    },
    silent: (flg) => {
      flgSilent = flg
    }
  }
}