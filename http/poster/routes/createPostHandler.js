import { postsData, sessionsData, usersData } from '../constants/index.js';
import { parseCookies } from '../utils/parseCookies.js';

export function createPostHandler(req, res) {
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
    const { title, body: postBody } = JSON.parse(body || '{}');

    if (!title?.trim() || !postBody?.trim()) {
      return res
        .status(400)
        .sendJson({ error: 'Title and body are required' });
    }

    const post = {
      id: postsData.length + 1,
      title: title.trim(),
      body: postBody.trim(),
      userId: user.id,
    };

    postsData.push(post);

    res.sendJson({
      ...post,
      author: user.name,
    });
  });
}
