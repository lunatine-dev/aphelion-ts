export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 400,
        public code?: string, // e.g., 'USER_NOT_FOUND'
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
