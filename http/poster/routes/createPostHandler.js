import { postsData, UNAUTHORIZED } from '../constants/index.js';

export function createPostHandler(req, res) {
  if (!req.user) {
    return res.status(401).sendJson(UNAUTHORIZED);
  }

  const user = req.user;
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString('utf-8');
  });

  req.on('end', () => {
    const { title, body: postBody } = JSON.parse(body || '{}');

    if (!title?.trim() || !postBody?.trim()) {
      return res.status(400).sendJson({ error: 'Title and body are required' });
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
