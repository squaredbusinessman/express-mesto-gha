const ApplicationError = require('./ApplicationError');
const { UnAuthorizedErrorCode } = require('./errorsCodes');

class UnAuthorizedError extends ApplicationError {
  constructor(message) {
    super(UnAuthorizedErrorCode, message);
  }
}

module.exports = UnAuthorizedError;
