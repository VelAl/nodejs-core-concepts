import { postsData, usersData } from '../constants/index.js';

export function getPostsHandler(req, res) {
  const posts = postsData.map((post) => {
    const user = usersData.find((user) => user.id === post.userId);

    return {
      ...post,
      author: user.name,
    };
  });

  res.sendJson(posts);
}
