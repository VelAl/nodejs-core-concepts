import { INVALID_JSON } from '../constants/index.js';

export async function parseJson(req, res) {
  const contentType = req.headers['content-type'] || '';

  if (!contentType.includes('application/json')) {
    req.body = {};
    return;
  }

  let raw = '';

  for await (const chunk of req) {
    raw += chunk.toString('utf-8');
  }

  try {
    req.body = JSON.parse(raw || '{}');
  } catch {
    return res.status(400).sendJson(INVALID_JSON);
  }
}
