# Poster

Educational project: a small Express-like wrapper around Node's `http` module, built to better understand how HTTP servers and middleware work.

## mini-express

Located in `../mini-express`. A tiny utility that wraps `http.createServer` and provides:

- `route(method, path, handler)` — register handlers
- `addMiddleware(fn)` — run shared logic before the route
- helpers on the response: `status`, `sendJson`, `sendFile`

Request flow: middleware chain → matched route handler (or 404).

## Poster app flow

1. Client loads the SPA from `public/` (HTML/CSS/JS).
2. Middleware parses JSON bodies and attaches `req.user` from the session cookie.
3. API routes under `/api/*` handle login, logout, user profile, and posts (in-memory data).
4. SPA page paths serve `index.html` so client-side routing survives refresh.
