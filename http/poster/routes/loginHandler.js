import { sessionsData, usersData } from '../constants/index.js';

export function loginHandler(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString('utf-8');
  });

  req.on('end', () => {
    const { username, password } = JSON.parse(body || '{}');

    if (!username?.trim() || !password?.trim()) {
      return res
        .status(400)
        .sendJson({ error: 'Username and password are required' });
    }

    const user = usersData.find((user) => user.username === username);

    if (!user || user.password !== password) {
      return res
        .status(401)
        .sendJson({ error: 'Invalid username or password' });
    }

    const token = crypto.randomUUID();

    const session = {
      id: sessionsData.length + 1,
      token,
      userId: user.id,
    };

    sessionsData.push(session);

    res.setHeader(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );
    res.sendJson({ message: 'Login successful' });
  });
}
