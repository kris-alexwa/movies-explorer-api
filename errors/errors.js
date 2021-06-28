class ErrorWithStatusCode extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ValidationError extends ErrorWithStatusCode {
  constructor(message) {
    super(400, message);
  }
}

class UnauthorizedError extends ErrorWithStatusCode {
  constructor(message) {
    super(401, message);
  }
}

class ForbiddenError extends ErrorWithStatusCode {
  constructor(message) {
    super(403, message);
  }
}

class NotFoundError extends ErrorWithStatusCode {
  constructor(message) {
    super(404, message);
  }
}

class ConflictError extends ErrorWithStatusCode {
  constructor(message) {
    super(409, message);
  }
}

module.exports = {
  ErrorWithStatusCode,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
