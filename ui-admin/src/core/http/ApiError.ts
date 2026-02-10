export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(status: number, body?: any) {
    super(body?.detail || "Erro na API");
    this.status = status;
    if (body?.detail) this.details = body.detail;
  }
}
