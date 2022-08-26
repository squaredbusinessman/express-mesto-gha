const ApplicationError = require('./ApplicationError');

class IncorrectDataSent extends ApplicationError {
  constructor(objError) {
    super(400, `Переданы некорректные данные в методы ${objError}`);
  }
}

module.exports = IncorrectDataSent;
