const ApplicationError = require('./ApplicationError');

class CardNotFound extends ApplicationError {
  constructor() {
    super(404, 'Карточка не найдена (указан неверный id)');
  }
}

module.exports = CardNotFound;
