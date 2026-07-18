// Builds an absolute, publicly reachable URL for an uploaded file.
export const buildFileUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};
