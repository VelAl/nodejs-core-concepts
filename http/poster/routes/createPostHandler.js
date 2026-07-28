import { postsData, UNAUTHORIZED } from '../constants/index.js';

export function createPostHandler(req, res) {
  if (!req.user) {
    return res.status(401).sendJson(UNAUTHORIZED);
  }

  const { title, body } = req.body;

  if (!title?.trim() || !body?.trim()) {
    return res.status(400).sendJson({ error: 'Title and body are required' });
  }

  const post = {
    id: postsData.length + 1,
    title: title.trim(),
    body: body.trim(),
    userId: req.user.id,
  };

  postsData.push(post);

  res.sendJson({
    ...post,
    author: req.user.name,
  });
}
