const httpContext = require('../../../infra/httpContext/cls')
const tracer = require('dd-trace')
var md5 = require('md5')

const getClient = (req) => {
  return (req.headers['referer'] && req.headers['referer'].startsWith(process.env.UI_URL)) ? 'web' : 'web_admin'
}
module.exports = () => {

  return (req, res, next) => {
    httpContext.set('currentuser', req.user)
    httpContext.set('client', getClient(req))
    httpContext.set('apiName', req.baseUrl + req.path)
    httpContext.set('ip', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    httpContext.set('cf-ray', req.headers['cf-ray'])
    httpContext.set('userAgent', req.headers['user-agent'])
    httpContext.set('trackingCode', req.query.trackingCode)
    httpContext.set('courseType', req.query.courseType)
    httpContext.set('referer', req.headers.referer)
    let secretKeys = 'NonSenstive'
    let secretHash = 'Secret-Hash'
    if (req && req.body && req.body.password) {
      secretKeys += '|' + req.body.password
      httpContext.set('password', req.body.password)
    }
    if (req && ((req.body && req.body.token) || (req.query && req.query.token))) {
      secretKeys += '|' + (req.body.token || req.query.token)
      httpContext.set('token', req.body.token || req.query.token)
    }
    if (req && req.user) {
      if (req.user.email) {
        secretHash = 'EMAIL' + md5(req.user.email)
      } else if (req.user.mobile) {
        secretHash = 'MOB' + md5(req.user.mobile)
      }
    } else if (req && req.body) {
      if (req.body.emailOrMobile) {
        const isEmail = req.body.emailOrMobile && req.body.emailOrMobile.indexOf('@') > 0
        secretHash = isEmail ? 'EMAIL' + md5(req.body.emailOrMobile) : 'MOB' + md5(req.body.emailOrMobile)
      } else if (req.body.email) {
        secretHash = 'EMAIL' + md5(req.body.email)
      }
    }
    httpContext.set('secretKeys', secretKeys)
    httpContext.set('secretHash', secretHash)
    let span = tracer.scope().active()
    if (span == null) {
      span = tracer.startSpan('web.request')
    }
    if (span !== null && req.user != null) {
      span.setTag('loginuser.id', req.user.id)
      span.setTag('loginuser.email', req.user.email)
      span.setTag('loginuser.mobile', req.user.mobile)
      span.setTag('request_id', req.request_id)
      span.setTag('ip', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
      span.setTag('apiName', req.path)
    }
    next()
  }
}
