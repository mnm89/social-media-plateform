const fs = require("fs");
const { Storage } = require("../models");

/**
 *
 * @param {string} filePath
 * @param {Storage} storage
 * @param {import("minio").Client} minioClient
 * @param {string} userId
 * @param {string} originalname
 * @param {string} mimetype
 */
const uploadFileToMinio = async (
  filePath,
  storage,
  minioClient,
  userId,
  originalname,
  mimetype
) => {
  try {
    await minioClient.fPutObject(
      storage.get("bucket"),
      storage.get("path"),
      filePath,
      {
        "Content-Type": mimetype,
        "x-amz-meta-storageId": storage.get("id"),
        "x-amz-meta-userId": userId,
        "x-amz-meta-originalName": originalname,
      }
    );

    // Clean up: Remove the file after successful upload
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  } catch (error) {
    console.error("Error during MinIO upload process:", error);
    throw error;
  }
};

module.exports = { uploadFileToMinio };
