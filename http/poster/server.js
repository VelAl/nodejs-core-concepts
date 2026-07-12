import { join } from 'node:path';
import { MiniExpress } from '../mini-express/index.js';
import { GET, PORT, staticRoutes } from './constants/index.js';

const server = new MiniExpress();

// ====== FILE ROUTES ======
staticRoutes.forEach(({ path, fileName, type }) => {
  server.route(GET, path, (req, res) => {
    const filePath = join(process.cwd(), 'public', fileName);

    res.sendFile(filePath, type);
  });
});

server.listen(PORT, () => {});
