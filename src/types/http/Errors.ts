export class ApiError extends Error {}
export class NotFoundError extends ApiError {}
export class AuthenticationError extends ApiError {}
export class NoAuthHeaderError extends ApiError {}
export class NoBearerTokenError extends ApiError {}
export class AuthorizationError extends ApiError {}
