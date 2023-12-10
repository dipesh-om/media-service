import { define } from '../../../containerHelper'
const _ = require('lodash')

module.exports = define('generalUtil', ({ logger, constants }) => {

  const getPlainObject = (modelObj) => {
    if (!modelObj) {
      return
    }
    if (modelObj.dataValues) {
      return modelObj.get({ plain: true })
    }
    return modelObj
  }

  const getPlainObjects = (modelObjs) => {
    if (!modelObjs) {
      return
    }
    if (_.isArray(modelObjs)) {
      return _.map(modelObjs, modelObj => getPlainObject(modelObj))
    } else {
      return getPlainObject(modelObjs)
    }
  }

  const getMongoosePlainObject = (mongooseObj) => {
    try {
      mongooseObj = mongooseObj.toObject()
      return mongooseObj
    } catch (e) {
      return mongooseObj
    }
  }

  const getMongoosePlainObjects = (mongooseObjs) => {
    if (!mongooseObjs) {
      return
    }
    if (_.isArray(mongooseObjs)) {
      return _.map(mongooseObjs, mongooseObj => getMongoosePlainObject(mongooseObj))
    } else {
      return getMongoosePlainObject(mongooseObjs)
    }
  }


  const asyncHandler = fn => (req, res, next) =>
    Promise
      .resolve(fn(req, res, next))
      .catch(next)

  return {
    asyncHandler,
    getPlainObject,
    getPlainObjects,
    getMongoosePlainObject,
    getMongoosePlainObjects
  }

})