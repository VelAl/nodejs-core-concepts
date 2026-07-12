import { MiniExpress } from '../mini-express/index.js';
import { PORT } from './constants.js';

const server = new MiniExpress();

server.listen(PORT, () => {});
