import { GET } from '../constants/index.js';
import { postsHandler } from './postsHandler.js';

export const apiRoutes = [
  {
    method: GET,
    path: '/api/posts',
    handler: postsHandler,
  },
];
