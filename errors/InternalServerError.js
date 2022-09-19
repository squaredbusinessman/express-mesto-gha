const ApplicationError = require('./ApplicationError');
const { InternalErrorCode } = require('./errorsCodes');

class InternalServerError extends ApplicationError {
  constructor(message) {
    super(InternalErrorCode, message);
  }
}

module.exports = InternalServerError;
