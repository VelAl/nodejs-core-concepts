import { GET, POST } from '../constants/index.js';
import { loginHandler } from './loginHandler.js';
import { postsHandler } from './postsHandler.js';
import { userHandler } from './userHandler.js';

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
  {
    method: GET,
    path: '/api/user',
    handler: userHandler,
  },
];
