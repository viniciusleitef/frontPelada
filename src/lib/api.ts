const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function authHeader(): Record<string, string> {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    let message = res.statusText;
    try {
      const d = await res.json();
      message = d?.detail || message;
    } catch {}
    throw new Error(message);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  // @ts-ignore
  return undefined;
}

export const api = {
  get<T>(path: string) {
    return request<T>(path, { headers: authHeader() });
  },
  post<T>(path: string, body: any) {
    return request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(body),
    });
  },
  put<T>(path: string, body: any) {
    return request<T>(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(body),
    });
  },
  del(path: string) {
    return request<void>(path, { method: "DELETE", headers: authHeader() });
  },
};

export { BASE_URL };

