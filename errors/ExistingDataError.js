const ApplicationError = require('./ApplicationError');
const { ExistingEmailErrorCode } = require('./errorsCodes');

class ExistingDataError extends ApplicationError {
  constructor(message) {
    super(ExistingEmailErrorCode, message);
  }
}

module.exports = ExistingDataError;
