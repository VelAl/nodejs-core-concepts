import http from 'http';
import fs from 'node:fs/promises';

class MiniExpress {
  constructor() {
    this.server = http.createServer();

    this.routes = {};
    this.middlewares = [];

    this.server.on('request', async (request, response) => {
      await this.#runMiddlewares(request, response);

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

  addMiddleware(callback) {
    this.middlewares.push(callback);
  }

  listen(port, callback) {
    this.server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);

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

  // A for-of loop is used for simplicity. Express uses a recursive next() callback chain.
  #runMiddlewares = async (request, response) => {
    for (const middleware of this.middlewares) {
      await middleware(request, response);
    }
  };
}

export { MiniExpress };
