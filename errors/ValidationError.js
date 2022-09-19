const ApplicationError = require('./ApplicationError');
const { ValidationErrorCode } = require('./errorsCodes');

class ValidationError extends ApplicationError {
  constructor(message) {
    super(ValidationErrorCode, message);
  }
}

module.exports = ValidationError;
