const apiHost = import.meta.env.VITE_API_HOST || 'http://localhost:8081/api/';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function buildUrl(path: string) {
  return new URL(path.replace(/^\/+/, ''), apiHost).toString();
}

export async function apiPost<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const response = await fetch(buildUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as TResponse | { message?: string } | null;

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && data.message
        ? data.message
        : 'No se pudo completar la solicitud';
    throw new ApiError(message, response.status);
  }

  return data as TResponse;
}

export async function apiGet<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(buildUrl(path), {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  const data = (await response.json().catch(() => null)) as TResponse | { message?: string } | null;

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && data.message
        ? data.message
        : 'No se pudo completar la solicitud';
    throw new ApiError(message, response.status);
  }

  return data as TResponse;
}

export async function apiPostWithoutPayload<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  const data = (await response.json().catch(() => null)) as TResponse | { message?: string } | null;

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && data.message
        ? data.message
        : 'No se pudo completar la solicitud';
    throw new ApiError(message, response.status);
  }

  return data as TResponse;
}
