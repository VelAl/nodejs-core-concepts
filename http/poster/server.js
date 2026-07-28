import { join } from 'node:path';
import { MiniExpress } from '../mini-express/index.js';
import { GET, PORT, spaPages, staticRoutes } from './constants/index.js';
import { attachUser } from './middlewares/attachUser.js';
import { parseJson } from './middlewares/parseJson.js';
import { apiRoutes } from './routes/index.js';

const server = new MiniExpress();

server.addMiddleware(parseJson);
server.addMiddleware(attachUser);

const indexHtml = join(process.cwd(), 'public', 'index.html');

// ====== SPA PAGES ======
spaPages.forEach((path) => {
  server.route(GET, path, (req, res) => {
    res.sendFile(indexHtml, 'text/html');
  });
});

// ====== STATIC ASSETS ======
staticRoutes.forEach(({ path, fileName, type }) => {
  server.route(GET, path, (req, res) => {
    const filePath = join(process.cwd(), 'public', fileName);

    res.sendFile(filePath, type);
  });
});

// ====== JSON ROUTES ======
apiRoutes.forEach(({ method, path, handler }) => {
  server.route(method, path, handler);
});

server.listen(PORT, () => {});
