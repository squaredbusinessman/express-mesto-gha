import ApplicationError from "./ApplicationError";

export default class UserNotFound extends ApplicationError {
  constructor() {
    super(404, 'Пользователь не найден');
  }
}
