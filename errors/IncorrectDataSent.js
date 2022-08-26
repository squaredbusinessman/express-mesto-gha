const ApplicationError = require('./ApplicationError');

class IncorrectDataSent extends ApplicationError {
  constructor(objError) {
    super(400, `Переданы некорректные данные в методы создания ${objError}`);
  }
}

module.exports = IncorrectDataSent;
