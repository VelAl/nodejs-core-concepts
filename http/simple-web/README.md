# simple-web

A simple HTTP server built with plain Node.js (`node:http`), no frameworks.

Serves static files from `public/`, accepts file uploads via `PATCH /upload`, and serves the saved image at `GET /image/file`.

## Run

```bash
node server.js
```

The server listens on port `9000`: http://localhost:9000

## Pages

| URL | Description |
|-----|-------------|
| `/` | Home |
| `/about` | About |
| `/upload` | Image upload |
| `/image` | View uploaded image |

Unknown routes return a 404 page.

## Structure

- `server.js` — entry point, request handling
- `routes.js` — URL → file map for `public/`
- `upload.js` — file upload (`PATCH /upload`)
- `image.js` — serve file from `store/`
- `utils.js` — helpers (e.g. `sendFile`)
- `public/` — HTML, CSS, JS
- `store/` — saved files
