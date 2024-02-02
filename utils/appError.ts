class AppError extends Error {
  status: string;

  isOperational: boolean;

  constructor(message: string, public statusCode: number) {
    super(message);

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.message = message;
    this.isOperational = true;
  }
}

module.exports = AppError;
