export async function api<T = any>(
  path: string,
  options: { method?: string; token?: string; body?: object } = {}
): Promise<T> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(options.token && { Authorization: `Bearer ${options.token}` }),
    },
    body: options.body && JSON.stringify(options.body),
    cache: "no-store",
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}
