// src/errors/api.errors.ts
export class ApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  
  export class NotFoundError extends ApiError {
    constructor(resource: string = 'Resource') {
      super(`${resource} not found`, 404);
    }
  }
  
  export class AlreadyExistsError extends ApiError {
    constructor(resource: string = 'Resource') {
      super(`${resource} already exists`, 409); // HTTP 409 Conflict
    }
  }
  
  export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad request') {
      super(message, 400);
    }
  }
  
  export class UnauthorizedError extends ApiError {
    constructor(message: string = 'Unauthorized') {
      super(message, 401);
    }
  }

  export class ForbiddenError extends ApiError {
    constructor(message: string = 'Forbidden') {
      super(message, 403);
    }
  }