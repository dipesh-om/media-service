const jwt = require('jsonwebtoken')
const _ = require('lodash')

module.exports = ({ CustomError, constants, config }) => {
    const { UNAUTHORIZED_REQUEST } = constants
    return async (req, _res, next) => {
        try {
            if (config.EXTERNAL_APP_VALIDATE === 'true') {
                let jwtToken = _.get(req, 'headers.authorization', null)
                if (!jwtToken) throw new CustomError(UNAUTHORIZED_REQUEST.code, UNAUTHORIZED_REQUEST.status,'AUTHORIZATION_PARAMS_MISSING')
                jwtToken = String(jwtToken).split('Bearer ')[1]
                if (!jwtToken) throw new CustomError(UNAUTHORIZED_REQUEST.code, UNAUTHORIZED_REQUEST.status,'AUTHORIZATION_TOKEN_NOT_IN_PROPER_FORMET')
                const tokenData = jwt.decode(jwtToken, { complete: true })
                if (!tokenData) throw new CustomError(UNAUTHORIZED_REQUEST.code, UNAUTHORIZED_REQUEST.status,'AUTHORIZATION_TOKEN_MISSING_DATA')
                const requesterAppName = _.get(req, 'headers.x-app-name', null)
                if (!tokenData.payload?.app_name) throw new CustomError(UNAUTHORIZED_REQUEST.code, UNAUTHORIZED_REQUEST.status,'AUTHORIZATION_TOKEN_MISSING_APP_NAME')
                if (requesterAppName != tokenData.payload?.app_name) throw new CustomError(UNAUTHORIZED_REQUEST.code, UNAUTHORIZED_REQUEST.status,'AUTHORIZATION_APP_NAME_MISS_MATCH')
                try {
                    jwt.verify(jwtToken, config.EXTERNAL_APP_VERIFIER_PUBLIC_KEY)
                } catch (e) {
                    throw new CustomError(UNAUTHORIZED_REQUEST.code, UNAUTHORIZED_REQUEST.status,'AUTHORIZATION_APP_TOKEN_INVALID')
                }
            }
        } catch (e) {
            next(e)
        }
        next()
    }
}
