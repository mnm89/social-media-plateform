const express = require("express");
const multer = require("multer");
const { Storage } = require("../models");
const path = require("path");
/**
 * @type {import('minio').Client}
 */
const minioClient = require("../config/minio");
const { getFileTypeFromMimeType } = require("../helpers/fileType");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() }).single("file");

router.post("/upload", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: err.message });
    }

    const { externalId, entityType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file provided." });
    }

    try {
      const storage = new Storage({
        entityType,
        externalId,
        type: getFileTypeFromMimeType(file.mimetype),
        bucket: process.env.MINIO_BUCKET_NAME,
      });

      const fileName = `${storage.get("id")}${path.extname(file.originalname)}`;
      storage.set(
        "path",
        externalId ? `${externalId}/${fileName}` : `${fileName}`
      );

      await minioClient.putObject(
        storage.get("bucket"),
        storage.get("path"),
        file.buffer,
        file.size,
        {
          storageId: storage.get("id"),
          originalName: file.originalname,
          mimeType: file.mimetype,
        }
      );
      await storage.save();
      res.status(201).json(storage);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file." });
    }
  });
});

router.get("/", async (req, res) => {
  try {
    const storages = await Storage.findAll({
      where: {
        bucket: process.env.MINIO_BUCKET_NAME,
      },
    });
    res.status(200).json(storages);
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const storage = await Storage.findByPk(id);
    if (!storage) {
      return res.status(404).json({ message: "Storage not found." });
    }

    res.status(200).json(storage);
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const storage = await Storage.findByPk(id);
    if (!storage) {
      return res.status(404).json({ message: "Storage not found." });
    }
    await minioClient.removeObject(storage.get("bucket"), storage.get("path"));
    await storage.destroy();

    res.status(204).send(); // No content response
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.post("/signed-url", async (req, res) => {
  const { storageId } = req.body;

  try {
    const storage = await Storage.findByPk(storageId);
    if (!storage) {
      return res.status(404).json({ message: "Storage not found." });
    }
    const signedUrl = await minioClient.presignedUrl(
      "GET",
      storage.get("bucket"),
      storage.get("path"),
      60 * 60 // Expiry time in seconds (e.g., 1 hour)
    );

    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
module.exports = router;
