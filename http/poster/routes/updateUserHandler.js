import { sessionsData, usersData } from '../constants/index.js';
import { parseCookies } from '../utils/parseCookies.js';

export function updateUserHandler(req, res) {
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

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString('utf-8');
  });

  req.on('end', () => {
    const { name, username, password } = JSON.parse(body || '{}');

    if (!name?.trim() || !username?.trim()) {
      return res
        .status(400)
        .sendJson({ error: 'Name and username are required' });
    }

    const usernameTaken = usersData.some(
      (existingUser) =>
        existingUser.username === username.trim() &&
        existingUser.id !== user.id
    );

    if (usernameTaken) {
      return res.status(409).sendJson({ error: 'Username already taken' });
    }

    user.name = name.trim();
    user.username = username.trim();

    if (password?.trim()) {
      user.password = password;
    }

    const { password: _password, ...safeUser } = user;

    res.sendJson(safeUser);
  });
}
