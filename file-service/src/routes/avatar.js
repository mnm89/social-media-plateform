const express = require("express");
const multer = require("multer");
const keycloak = require("../config/keycloak");
const { Storage } = require("../models");
const path = require("path");
/**
 * @type {import('minio').Client}
 */
const minioClient = require("../config/minio");
const { getFileTypeFromMimeType } = require("../helpers/fileType");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() }).single("file");

router.post("/", keycloak.protect("realm:user"), async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file provided." });

    const userId = req.kauth.grant.access_token.content.sub;

    try {
      let storage = await Storage.findOne({
        where: {
          entityType: "user",
          externalId: userId,
          bucket: "avatars",
        },
      });

      if (!storage)
        storage = new Storage({
          entityType: "user",
          externalId: userId,
          bucket: "avatars",
        });

      storage.set("type", getFileTypeFromMimeType(file.mimetype));
      storage.set(
        "path",
        `${storage.get("id")}${path.extname(file.originalname)}`
      );

      await minioClient.putObject(
        storage.get("bucket"),
        storage.get("path"),
        file.buffer,
        file.size,
        {
          storageId: storage.get("id"),
          userId,
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

router.get("/", keycloak.protect("realm:user"), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  try {
    const avatar = await Storage.findOne({
      where: {
        externalId: userId,
        entityType: "user",
      },
    });
    const signedUrl = new URL(
      await minioClient.presignedUrl(
        "GET",
        storage.get("bucket"),
        storage.get("path")
      )
    );

    const url = `${signedUrl.origin}${signedUrl.pathname}`;
    res.json({ ...avatar.dataValues, url });
  } catch (error) {
    console.error("Error retrieving medias:", error);
    res.status(500).json({ message: "Failed to retrieve post medias" });
  }
});

router.get("/:userId", keycloak.protect("realm:service"), async (req, res) => {
  const userId = req.params.userId;
  try {
    const avatar = await Storage.findOne({
      where: {
        externalId: userId,
        entityType: "user",
      },
    });
    const signedUrl = new URL(
      await minioClient.presignedUrl(
        "GET",
        storage.get("bucket"),
        storage.get("path")
      )
    );
    const url = `${signedUrl.origin}${signedUrl.pathname}`;

    res.json({ ...avatar.dataValues, url });
  } catch (error) {
    console.error("Error retrieving medias:", error);
    res.status(500).json({ message: "Failed to retrieve post medias" });
  }
});

router.delete(
  "/:storageId",
  keycloak.protect("realm:user"),
  async (req, res) => {
    try {
      const storage = await Storage.findOne({
        where: {
          id: req.params.storageId,
          externalId: req.kauth.grant.access_token.content.sub,
          entityType: "user",
        },
      });

      if (!storage)
        return res.status(404).json({ message: "Storage not found" });

      await minioClient.removeObject(
        storage.get("bucket"),
        storage.get("path")
      );
      await storage.destroy();

      res.status(204).send(); // No content response
    } catch (error) {
      console.error("Error retrieving storage:", error);
      res.status(500).json({ message: "Failed to retrieve storage media" });
    }
  }
);

module.exports = router;
