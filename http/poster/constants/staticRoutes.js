// Client-side pages that should serve index.html on refresh / direct visit
export const spaPages = ['/', '/login', '/new-post', '/profile'];

// Static assets
export const staticRoutes = [
  { path: '/styles.css', fileName: 'styles.css', type: 'text/css' },
  { path: '/scripts.js', fileName: 'scripts.js', type: 'text/javascript' },
];
