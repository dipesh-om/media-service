const jwt = require('jsonwebtoken')

module.exports = ({ CustomError, constants, config }) => {
    const { UNAUTHORIZED_REQUEST } = constants
    return async (req, _res, next) => {
        if (config.EXTERNAL_APP_VALIDATE === 'true') {
            const jwtToken = _.get(req, 'headers.authorization', null)
            if (!jwtToken) throw new CustomError(UNAUTHORIZED_REQUEST.code, 'AUTHORIZATION_PARAMS_MISSING')
            jwtToken = String(jwtToken).split('Bearer ')[jwtToken.length - 1]
            if (!jwtToken) throw new CustomError(UNAUTHORIZED_REQUEST.code, 'AUTHORIZATION_TOKEN_NOT_IN_PROPER_FORMET')
            const tokenData = jwt.decode(jwtToken, { complete: true })
            if (!tokenData) throw new CustomError(UNAUTHORIZED_REQUEST.code, 'AUTHORIZATION_TOKEN_MISSING_DATA')
            const requesterAppName = _.get(req, 'headers.x-app-name', null)
            if (!tokenData.x - app - name) throw new CustomError(UNAUTHORIZED_REQUEST.code, 'AUTHORIZATION_TOKEN_MISSING_APP_NAME')
            if (requesterAppName != tokenData.x - app - name) throw new CustomError(UNAUTHORIZED_REQUEST.code, 'AUTHORIZATION_APP_NAME_MISS_MATCH')
            try {
                verifierPublicKey = config.EXTERNAL_APP_VERIFIER_PUBLIC_KEY
                await jwt.verify(jwtToken, verifierPublicKey)
            } catch (e) {
                throw new CustomError(UNAUTHORIZED_REQUEST.code, 'AUTHORIZATION_APP_TOKEN_INVALID')
            }
        }
        next()
    }
}
