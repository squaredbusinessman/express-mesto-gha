import ApplicationError from "./ApplicationError";

export default class IncorrectDataSent extends ApplicationError {
  constructor(objError) {
    super(400, `Переданы некорректные данные в методы создания ${objError}`);
  }
}
