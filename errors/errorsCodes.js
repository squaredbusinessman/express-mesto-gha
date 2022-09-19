// 200 - success
// 201 - success, resource created
// 401 - not authorized
// 403 - authorized, but bo access
// 500 - server error
// 400 - not valid data in req
// 422 - unprocessable entity
// 404 - not found

const DuplicateErrorCode = 11000;
const InternalErrorCode = 500;
const ValidationErrorCode = 400;
const NotFoundErrorCode = 404;
const UnAuthorizedErrorCode = 401;
const ExistingEmailErrorCode = 409;
const AccessErrorCode = 403;

module.exports = {
  InternalErrorCode,
  ValidationErrorCode,
  NotFoundErrorCode,
  UnAuthorizedErrorCode,
  ExistingEmailErrorCode,
  AccessErrorCode,
  DuplicateErrorCode,
};
