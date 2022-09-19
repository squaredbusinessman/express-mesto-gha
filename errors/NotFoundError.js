const ApplicationError = require('./ApplicationError');
const { NotFoundErrorCode } = require('./errorsCodes');

class NotFoundError extends ApplicationError {
  constructor(message) {
    super(NotFoundErrorCode, message);
  }
}

module.exports = NotFoundError;
