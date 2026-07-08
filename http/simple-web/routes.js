export const routes = {
  '/': {
    file: 'home/index.html',
    type: 'text/html',
  },
  '/about': {
    file: 'about/index.html',
    type: 'text/html',
  },
  '/shared/base.css': {
    file: 'shared/base.css',
    type: 'text/css',
  },
  '/home/script.js': {
    file: 'home/script.js',
    type: 'application/javascript',
  },
  '/upload': {
    file: 'upload/index.html',
    type: 'text/html',
  },
  '/upload/script.js': {
    file: 'upload/script.js',
    type: 'application/javascript',
  },
  '/upload/upload.css': {
    file: 'upload/upload.css',
    type: 'text/css',
  },
  '/image': {
    file: 'image/index.html',
    type: 'text/html',
  },
  '/image/script.js': {
    file: 'image/script.js',
    type: 'application/javascript',
  },
  '/image/image.css': {
    file: 'image/image.css',
    type: 'text/css',
  },
};

export const notFound = {
  file: 'not-found/index.html',
  type: 'text/html',
};
