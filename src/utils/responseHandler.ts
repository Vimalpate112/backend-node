import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | object;
}

export const sendSuccessResponse = <T>(
  res: Response,
  message = 'Success',
  statusCode = 200,
  data: T
): Response<ApiResponse<T>> => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendErrorResponse = (
  res: Response,
  error: string | object,
  message = 'An error occurred',
  statusCode = 500
): Response<ApiResponse<null>> => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    error,
  };
  return res.status(statusCode).json(response);
};
