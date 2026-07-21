import { DELETE, GET, POST, PUT } from '../constants/index.js';
import { createPostHandler } from './createPostHandler.js';
import { getUserHandler } from './getUserHandler.js';
import { loginHandler } from './loginHandler.js';
import { logoutHandler } from './logoutHandler.js';
import { getPostsHandler } from './getPostsHandler.js';
import { updateUserHandler } from './updateUserHandler.js';

export const apiRoutes = [
  {
    method: GET,
    path: '/api/posts',
    handler: getPostsHandler,
  },
  {
    method: POST,
    path: '/api/posts',
    handler: createPostHandler,
  },
  {
    method: POST,
    path: '/api/login',
    handler: loginHandler,
  },
  {
    method: DELETE,
    path: '/api/logout',
    handler: logoutHandler,
  },
  {
    method: GET,
    path: '/api/user',
    handler: getUserHandler,
  },
  {
    method: PUT,
    path: '/api/user',
    handler: updateUserHandler,
  },
];
