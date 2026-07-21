import { sessionsData } from '../constants/index.js';
import { parseCookies } from '../utils/parseCookies.js';

export function logoutHandler(req, res) {
  const { token } = parseCookies(req.headers.cookie);

  if (token) {
    const sessionIndex = sessionsData.findIndex(
      (session) => session.token === token
    );

    if (sessionIndex !== -1) {
      sessionsData.splice(sessionIndex, 1);
    }
  }

  res.setHeader(
    'Set-Cookie',
    'token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
  );

  res.sendJson({ message: 'Logout successful' });
}
