import { sessionsData, usersData } from '../constants/index.js';
import { parseCookies } from '../utils/parseCookies.js';

export function attachUser(req) {
  const { token } = parseCookies(req.headers.cookie);

  if (!token) {
    req.user = null;
    return;
  }

  const session = sessionsData.find((session) => session.token === token);

  if (!session) {
    req.user = null;
    return;
  }

  const user = usersData.find((user) => user.id === session.userId);

  req.user = user || null;
}
