const ApplicationError = require('./ApplicationError');
const { AccessErrorCode } = require('./errorsCodes');

class AccessError extends ApplicationError {
  constructor(message) {
    super(AccessErrorCode, message);
  }
}

module.exports = AccessError;
