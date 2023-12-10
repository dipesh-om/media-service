const winston = require('winston')
const expressWinston = require('express-winston')
var md5 = require('md5')
module.exports = ({ logger }) => {
  return expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.json()
    ),
    msg: 'HTTP Requests {{req.method}} {{req.path}}',
    requestWhitelist: ['params', 'method', 'path', 'query', 'body', 'headers.user-agent', 'headers.referer'],
    responseWhitelist: ['statusCode', 'responseTime'],
    bodyBlacklist: ['password', 'oldPassword', 'token', 'jwtToken', 'email', 'mobile', 'emailOrMobile'],
    ignoreRoute: function (req, res) {
      if (req.method === 'OPTIONS' || req.path === '/api/V1/healthCheck/getStatus' || req.path === '/api/V1/healthCheck/statusWithDelay') {
        return true
      }
      return false
    },
    dynamicMeta: function (req, res) {
      try {
        let data = { request_id: req.request_id, processId: process.pid }
        if (req.headers && req.headers['cf-ray']) {
          data = Object.assign(data, { rayId: req.headers['cf-ray'] })
        }
        return data
      } catch (e) {
        console.log(e)
        return { request_id: req.request_id, processId: process.pid }
      }
    }
  })
}
