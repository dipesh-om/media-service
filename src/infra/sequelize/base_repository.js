const _ = require('lodash')

// db operations, we can also enable audit in the system here!

class BaseRepository {
  constructor (model) {
    this.model = model
  }

  findById (id) {
    return this.model.findById(id)
  }

  async findAll (whereClause, includeModelQuery, order, otherQueryProp = {}) {
    const query = { where: whereClause }
    if (includeModelQuery) {
      query.include = includeModelQuery
    }
    if (order) {
      query.order = order
    }
    const { attributes, limit, offset } = otherQueryProp
    if (attributes) {
      query.attributes = attributes
    }
    if (limit) {
      query.limit = limit
    }
    if (offset) {
      query.offset = offset
    }
    const recordItems = await this.model.findAll(query)
    return _.map(recordItems, r => r.get({ plain: true }))
  }

  async count (whereClause, includeModelQuery) {
    const query = { where: whereClause }
    if (includeModelQuery) {
      query.include = includeModelQuery
    }
    return this.model.count(query)
  }

  async findOne (whereClause, includeModelQuery, order, otherQueryProp = {}) {
    whereClause.recordStatus = 1
    const query = { where: whereClause }
    if (includeModelQuery) {
      query.include = includeModelQuery
    }
    if (order) {
      query.order = order
    }
    const { attributes } = otherQueryProp
    if (attributes) {
      query.attributes = attributes
    }
    const recordItem = await this.model.findOne(query)
    if (!recordItem) {
      return null
    }
    return recordItem.get({ plain: true })
  }

  async update (updateParams, whereClause, audit) {
    const result = await this.model.update(updateParams, {
      where: whereClause
    })
    return result
  }

  async create (createRecord, audit) {
    const createdRecord = await this.model.create(createRecord)
    return createdRecord
  }

  async bulkCreate (createRecords, audit) {
    const createdRecords = await this.model.bulkCreate(createRecords)
    return createdRecords
  }
}

module.exports = BaseRepository
