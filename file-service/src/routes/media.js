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

router.post("/:postId", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file provided." });

    try {
      const storage = new Storage({
        entityType: "post",
        externalId: req.params.postId,
        type: getFileTypeFromMimeType(file.mimetype),
        bucket: "medias",
      });
      const fileName = `${storage.get("id")}${path.extname(file.originalname)}`;
      storage.set("path", `${req.params.postId}/${fileName}`);

      await minioClient.putObject(
        storage.get("bucket"),
        storage.get("path"),
        file.buffer,
        file.size,
        {
          storageId: storage.get("id"),
          postId: req.params.postId,
          originalName: file.originalname,
          mimeType: file.mimetype,
        }
      );

      await storage.save();
      res.status(201).json(storage);
    } catch (error) {
      console.error("Error during upload process:", error);
      res.status(500).json({ error: "Failed to upload file." });
    }
  });
});

router.get("/:postId", async (req, res) => {
  try {
    const medias = await Storage.findAll({
      where: {
        externalId: req.params.postId,
        entityType: "post",
      },
      order: [["createdAt", "ASC"]],
    });

    const signedMedias = await Promise.all(
      medias.map(async (storage) => {
        const signedUrl = await minioClient.presignedUrl(
          "GET",
          storage.get("bucket"),
          storage.get("path"),
          60 * 60 // Expiry time in seconds (e.g., 1 hour)
        );
        return {
          ...storage.dataValues,
          url: signedUrl,
        };
      })
    );

    res.json(signedMedias);
  } catch (error) {
    console.error("Error retrieving medias:", error);
    res.status(500).json({ message: "Failed to retrieve post medias" });
  }
});

router.delete("/:storageId", async (req, res) => {
  try {
    const storage = await Storage.findByPk(req.params.storageId);

    if (!storage) return res.status(404).json({ message: "Storage not found" });

    await minioClient.removeObject(storage.get("bucket"), storage.get("path"));
    await storage.destroy();

    res.status(204).send(); // No content response
  } catch (error) {
    console.error("Error retrieving storage:", error);
    res.status(500).json({ message: "Failed to retrieve storage media" });
  }
});

module.exports = router;
