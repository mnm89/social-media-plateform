const express = require("express");
const multer = require("multer");
const keycloak = require("../config/keycloak");
const { Storage } = require("../models");
const path = require("path");
/**
 * @type {import('ioredis').Redis}
 */
const cache = require("../config/cache");
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

      const signedUrl = new URL(
        await minioClient.presignedUrl(
          "GET",
          storage.get("bucket"),
          storage.get("path")
        )
      );

      const url = `${signedUrl.origin}${signedUrl.pathname}`;

      const avatar = { ...storage.dataValues, url };
      await cache.set(`avatar:${userId}`, JSON.stringify(avatar));
      res.status(201).json(avatar);
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
        avatar.get("bucket"),
        avatar.get("path")
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
        avatar.get("bucket"),
        avatar.get("path")
      )
    );
    const url = `${signedUrl.origin}${signedUrl.pathname}`;

    res.json({ ...avatar.dataValues, url });
  } catch (error) {
    console.error("Error retrieving avatar:", error);
    res.status(500).json({ message: "Failed to retrieve post medias" });
  }
});

router.delete("/", keycloak.protect("realm:user"), async (req, res) => {
  try {
    const storage = await Storage.findOne({
      where: {
        externalId: req.kauth.grant.access_token.content.sub,
        entityType: "user",
      },
    });

    if (!storage) return res.status(404).json({ message: "Storage not found" });

    await minioClient.removeObject(storage.get("bucket"), storage.get("path"));
    await storage.destroy();
    await cache.del(`avatar:${req.kauth.grant.access_token.content.sub}`);
    res.status(204).send(); // No content response
  } catch (error) {
    console.error("Error deleting storage:", error);
    res.status(500).json({ message: "Failed to delete avatar storage" });
  }
});

module.exports = router;