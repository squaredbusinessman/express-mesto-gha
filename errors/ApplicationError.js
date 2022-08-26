export default class ApplicationError extends Error {
  constructor(status = 500, message = 'Внутренняя ошибка сервера') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 200 - success
// 201 - success, resource created
// 401 - not authorized
// 403 - authorized, but bo access
// 500 - server error
// 400 - not valid data in req
// 422 - unprocessable entity
// 404 - not found
