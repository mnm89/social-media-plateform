const fs = require("fs");
/**
 * @type {import('minio').Client}
 */
const minioClient = require("../config/minio");

/**
 *
 * @param {Express.Multer.File} file
 * @param {import("../models").Storage} storage
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
const uploadFileToMinio = async (file, storage, userId) => {
  try {
    await minioClient.fPutObject(
      storage.get("bucket"),
      storage.get("path"),
      file.path,
      {
        "Content-Type": file.mimetype,
        "x-amz-meta-storageId": storage.get("id"),
        "x-amz-meta-userId": userId,
        "x-amz-meta-originalName": file.originalname,
      }
    );

    // Clean up: Remove the file after successful upload
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
    return true;
  } catch (error) {
    console.error("Error during MinIO upload process:", error);
    return false;
  }
};
/**
 *
 * @param {import("../models").Storage} storage
 * @returns {Promise<boolean>}
 */
async function deleteFileFromMinio(storage) {
  try {
    await minioClient.removeObject(storage.get("bucket"), storage.get("path"));
    return true;
  } catch (error) {
    console.error("Error during MinIO upload process:", error);
    return false;
  }
}

module.exports = { uploadFileToMinio, deleteFileFromMinio };
