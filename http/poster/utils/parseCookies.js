export function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce((cookies, pair) => {
    const [key, ...rest] = pair.trim().split('=');

    if (!key) return cookies;

    cookies[key] = rest.join('=');
    return cookies;
  }, {});
}
