// src/utils/response.js
// Format response yang konsisten untuk seluruh API

/**
 * Response sukses
 * @param {object} res - Express response object
 * @param {string} message - Pesan sukses
 * @param {any} data - Data yang dikembalikan
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Response error
 * @param {object} res - Express response object
 * @param {string} message - Pesan error
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {any} errors - Detail error (opsional)
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Response dengan paginasi
 * @param {object} res - Express response object
 * @param {string} message - Pesan sukses
 * @param {Array} data - Array data
 * @param {object} pagination - { total, page, limit, totalPages }
 */
export const paginatedResponse = (res, message, data, pagination) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};
