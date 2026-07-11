import http from 'http';
import fs from 'node:fs/promises';

class MiniExpress {
  constructor() {
    this.server = http.createServer();

    this.routes = {};

    this.server.on('request', (request, response) => {
      const key = this.#formKey(request.method, request.url);
      const route = this.routes[key];

      if (route) {
        response.sendFile = async (path, mime) => {
          const fileHandle = await fs.open(path, 'r');
          const fileStream = fileHandle.createReadStream();

          response.setHeader('Content-Type', mime);

          fileStream.pipe(response);
        };

        response.sendJson = (json) => {
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify(json));
        };

        response.status = (code) => {
          response.statusCode = code;
          return response;
        };

        route(request, response);
      } else {
        const isRoute = this.#routesHavePath(request.url);

        if (isRoute) {
          response.writeHead(404, { 'Content-Type': 'text/plain' });
          response.end('Method Not Allowed');
        } else {
          response.writeHead(404, { 'Content-Type': 'text/plain' });
          response.end('Route Not Found');
        }
      }
    });
  }

  route(method, path, callback) {
    const key = this.#formKey(method, path);
    this.routes[key] = callback;
  }

  listen(port, callback) {
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);

      callback();
    });
  }

  #formKey(method, path) {
    return `${method}:${path}`.toLowerCase();
  }

  #routesHavePath(rawPath) {
    const path = rawPath.split('?')[0]?.toLowerCase();

    return Object.keys(this.routes).some((key) => key.split(':')[1] === path);
  }
}

export { MiniExpress };
