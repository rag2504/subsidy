const KEY = "gh2_jwt";

export function setToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(KEY);
}

export function clearToken() {
  localStorage.removeItem(KEY);
}

export function authHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export function getRole(): string | null {
  try {
    const t = getToken();
    if (!t) return null;
    const payload = JSON.parse(atob(t.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}
