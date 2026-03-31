import _ from 'lodash'

const getInfo = (fields = [], object = {}) => {
  return _.pick(object, fields)
}

const getNameFromEmail = (email) => email.split('@')[0].replace(/[._]/g, ' ').trim()

export default {
  getInfo,
  getNameFromEmail
}
