// 200 - success
// 201 - success, resource created
// 401 - not authorized
// 403 - authorized, but bo access
// 500 - server error
// 400 - not valid data in req
// 422 - unprocessable entity
// 404 - not found

const InternalError = 500;
const ValidationError = 400;
const NotFoundError = 404;

module.exports = {
  InternalError,
  ValidationError,
  NotFoundError,
};
