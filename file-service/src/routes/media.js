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
const bucket = "medias";

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
      });
      const fileName = `${storage.get("id")}${path.extname(file.originalname)}`;
      const storagePath = `${req.params.postId}/${fileName}`;
      await minioClient.putObject(bucket, storagePath, file.buffer, file.size, {
        name: fileName,
        post: req.params.postId,
        originalName: file.originalname,
        mimeType: file.mimetype,
      });
      storage.set("url", `${bucket}/${storagePath}`);

      await storage.save();
      res.status(201).json(storage);
    } catch (error) {
      console.error("Error during upload process:", error);
      res.status(500).json({ error: "Failed to upload file." });
    }
  });
});

module.exports = router;
