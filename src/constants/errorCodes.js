import { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, INTERNAL_SERVER_ERROR, CONFLICT } from 'http-status'

export const errorCodes = {
  INVALID_REQUEST: {
    code: 'Invalid_Request',
    status: BAD_REQUEST
  },
  REQUEST_PAYLOAD_INVALID:{
    code:'request_payload_invalid',
    status:BAD_REQUEST
  },
  UNAUTHORIZED_REQUEST: {
    code: 'unauthorized',
    status: UNAUTHORIZED
  },
  RUNTIME_ERROR: {
    code: 400,
    status: BAD_REQUEST
  },
  ENROLMENT_ERROR: {
    code: 'ENROLMENT_ERROR',
    status: BAD_REQUEST
  },
  RATELIMIT_ERROR: {
    code: 'RATELIMIT_ERROR',
    status: BAD_REQUEST
  },
  INTERNAL_SERVER_ERROR: {
    code: 'SERVER_ERROR',
    status: BAD_REQUEST
  },
  RESOURCE_NOT_FOUND: {
    code: 'resource_not_found',
    status: BAD_REQUEST
  },
  NOT_FOUND_ERROR: {
    code: 404,
    status: BAD_REQUEST
  },
  TOKEN_EXPIRED: {
    code: 401,
    status: UNAUTHORIZED
  },
  HTTP_CONFLICT: {
    code: 409,
    status: CONFLICT
  },
  PARAMETER_MISSING: {
    code: 'PARAMETER MISSING',
    status: BAD_REQUEST
  },
  DATA_NOT_FOUND: {
    code: 'DATA NOT FOUND',
    status: BAD_REQUEST
  },
  SSO_ERROR: {
    code: 'SSO_ERROR',
    status: BAD_REQUEST,
    optionalCode: 400
  },
  RESOURCE_ALREADY_EXIST: {
    code: '409',
    status: CONFLICT
  },
  INVALID_KEY: {
    code: 'Invalid key',
    status: BAD_REQUEST
  }
}
