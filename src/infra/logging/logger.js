const fs = require('fs')
const winston = require('winston')
const existsSync = fs.existsSync
const mkdirSync = fs.mkdirSync
const createLogger = winston.createLogger
const _transports = winston.transports
const format = winston.format

if (!existsSync(`logs`)) {
  mkdirSync(`logs`)
}

module.exports = ({ config }) => {
  return createLogger({
    format: format.combine(
      format.errors({ stack: true }),
      format.timestamp(),
      format.json()
    ),
    transports: [
      new _transports.Console()
    ]
  })
}
