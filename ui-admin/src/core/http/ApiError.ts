export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, body?: unknown, fallbackMessage = "Erro na API") {
    const normalizedBody =
      body && typeof body === "object" ? (body as Record<string, unknown>) : {};

    const detail = normalizedBody.detail;
    const error = normalizedBody.error;
    const message =
      (typeof detail === "string" && detail) ||
      (error &&
      typeof error === "object" &&
      typeof (error as Record<string, unknown>).message === "string"
        ? ((error as Record<string, unknown>).message as string)
        : undefined) ||
      (typeof normalizedBody.message === "string"
        ? (normalizedBody.message as string)
        : undefined) ||
      fallbackMessage;

    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = body;
  }
}
