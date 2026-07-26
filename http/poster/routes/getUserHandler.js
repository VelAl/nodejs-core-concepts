import { UNAUTHORIZED } from '../constants/index.js';

export function getUserHandler(req, res) {
  if (!req.user) {
    return res.status(401).sendJson(UNAUTHORIZED);
  }

  const { password, ...safeUser } = req.user;

  res.sendJson(safeUser);
}
