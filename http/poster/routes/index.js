import { GET, POST } from '../constants/index.js';
import { loginHandler } from './loginHandler.js';
import { postsHandler } from './postsHandler.js';

export const apiRoutes = [
  {
    method: GET,
    path: '/api/posts',
    handler: postsHandler,
  },
  {
    method: POST,
    path: '/api/login',
    handler: loginHandler,
  },
];
