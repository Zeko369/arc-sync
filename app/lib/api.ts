const BASE_URL = `https://arc-sync-production.up.railway.app`;

export const api = async <T = {}>(
  path: string,
  options: { method?: string; body?: any } = {},
  token?: string
) => {
  const res = await fetch(`${BASE_URL}${!path.startsWith("/") ? "/" : ""}${path}`, {
    method: options.method || "GET",
    ...(options.body && {
      body: typeof options.body === "string" ? options.body : JSON.stringify(options.body)
    }),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  if (res.status === 401) {
    throw new Error("AUTH_ERROR");
  }

  return res.json() as T;
};
