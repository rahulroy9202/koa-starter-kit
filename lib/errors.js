class UnauthorizedError extends Error {}
class ForbiddenError extends Error {}
class NotFoundError extends Error {}
class ServerError extends Error {}

class ValidationError extends Error {
  // constructor() {
  //   super(arguments);
  //   if (arguments.length > 2) {
  //
  //   }
  // }
}

module.exports = {
  UnauthorizedError, // 401
  ForbiddenError, // 403
  ValidationError, //422
  NotFoundError, // 404
  ServerError // 500
};