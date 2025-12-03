export type ApiResponse<T> = { data: T; status: number };

export const apiClient = {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    // placeholder: implement fetch wrapper, auth headers
    const res = await fetch(url);
    const data = (await res.json()) as T;
    return { data, status: res.status };
  },

  async post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as T;
    return { data, status: res.status };
  },
};
