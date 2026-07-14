import { usersData } from '../constants/index.js';

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

    res.sendJson({ message: 'Login successful' });
  });
}
