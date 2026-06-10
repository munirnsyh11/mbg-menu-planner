export class ApiResponse {
  static ok(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data && { data }),
    });
  }

  static created(res, message = 'Created', data = null) {
    return res.status(201).json({
      success: true,
      message,
      ...(data && { data }),
    });
  }

  static error(res, message = 'Error', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  }
}