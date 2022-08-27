const ApplicationError = require('./ApplicationError');

class UserNotFound extends ApplicationError {
  constructor() {
    super(404, 'Пользователь не найден (указан неверный id)');
  }
}

module.exports = UserNotFound;
