// Standard success envelope: { success, message, data }
export const sendSuccess = (res, { status = 200, message = "OK", data = null } = {}) =>
  res.status(status).json({ success: true, message, data });

// Normalizes the User record for API responses (lowercase role, no password).
export const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role.toLowerCase(),
  avatarUrl: user.avatarUrl ?? null,
});
