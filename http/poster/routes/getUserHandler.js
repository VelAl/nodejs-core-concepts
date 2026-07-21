import { sessionsData, usersData } from '../constants/index.js';
import { parseCookies } from '../utils/parseCookies.js';

export function getUserHandler(req, res) {
  const { token } = parseCookies(req.headers.cookie);

  if (!token) {
    return res.status(401).sendJson({ error: 'Unauthorized' });
  }

  const session = sessionsData.find((session) => session.token === token);

  if (!session) {
    return res.status(401).sendJson({ error: 'Unauthorized' });
  }

  const user = usersData.find((user) => user.id === session.userId);

  if (!user) {
    return res.status(404).sendJson({ error: 'User not found' });
  }

  const { password, ...safeUser } = user;

  res.sendJson(safeUser);
}
