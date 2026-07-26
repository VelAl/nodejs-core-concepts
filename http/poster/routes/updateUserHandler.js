import { UNAUTHORIZED, usersData } from '../constants/index.js';

export function updateUserHandler(req, res) {
  if (!req.user) {
    return res.status(401).sendJson(UNAUTHORIZED);
  }

  const user = req.user;
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
        existingUser.username === username.trim() && existingUser.id !== user.id
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
