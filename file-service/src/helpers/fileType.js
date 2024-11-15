function getFileTypeFromMimeType(mimetype) {
  if (mimetype.includes("video")) return "video";
  if (mimetype.includes("image")) return "image";
  if (mimetype.includes("audio")) return "audio";
  return "other";
}
module.exports = { getFileTypeFromMimeType };
