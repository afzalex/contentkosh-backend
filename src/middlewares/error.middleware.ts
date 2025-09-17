import { Request, Response, NextFunction } from 'express';
import { AlreadyExistsError, ApiError, BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/api.errors';
import { ApiResponseHandler } from '../utils/apiResponse';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  
  if (err instanceof NotFoundError) {
    return ApiResponseHandler.notFound(res, err.message);
  }

  if (err instanceof BadRequestError) {
    return ApiResponseHandler.badRequest(res, err.message);
  }

  if (err instanceof AlreadyExistsError) {
    return ApiResponseHandler.error(res, err.message, 409);
  }

  if (err instanceof UnauthorizedError) {
    return ApiResponseHandler.unauthorized(res, err.message);
  }

  if (err instanceof ForbiddenError) {
    return ApiResponseHandler.forbidden(res, err.message);
  }

  if (err instanceof ApiError) {
    return ApiResponseHandler.error(res, err.message, err.statusCode);
  }

  return ApiResponseHandler.serverError(res);
}