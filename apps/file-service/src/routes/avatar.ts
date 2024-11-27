import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  deleteFileFromMinio,
  getFileTypeFromMimeType,
  uploadFileToMinio,
} from '../utils';
import {
  MinioConfig,
  KeycloakSessionConfig,
  CacheConfig,
} from '@social-media-platform/common-config';
import { Storage } from '../models/storage';
import { KeycloakRequest } from '@social-media-platform/keycloak-utils';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const { client } = MinioConfig();
const { keycloak } = KeycloakSessionConfig();
const { client: cache } = CacheConfig();

router.post(
  '/',
  keycloak.protect('realm:user'),
  upload.single('file'),
  async (req: KeycloakRequest, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file provided.' });
    const userId = req.kauth.grant.access_token.content.sub;
    try {
      let storage = await Storage.findOne({
        where: {
          entityType: 'user',
          externalId: userId,
          bucket: 'avatars',
        },
      });

      if (!storage) {
        storage = new Storage({
          entityType: 'user',
          externalId: userId,
          bucket: 'avatars',
        });
      } else {
        await deleteFileFromMinio(storage);
      }

      storage.set('type', getFileTypeFromMimeType(file.mimetype));
      storage.set(
        'path',
        `${storage.get('id')}${path.extname(file.originalname)}`
      );

      const uploaded = await uploadFileToMinio(file, storage, {
        'x-amz-meta-userId': userId,
      });
      if (!uploaded) res.status(500).json({ error: 'Failed to upload file.' });

      await storage.save();

      const signedUrl = new URL(
        await client.presignedUrl(
          'GET',
          storage.get('bucket'),
          storage.get('path')
        )
      );

      const url = `${signedUrl.origin}${signedUrl.pathname}`;
      const avatar = { ...storage.dataValues, url };
      await cache.set(`avatar:${userId}`, JSON.stringify(avatar));
      res.status(201).json(avatar);
    } catch (error) {
      console.error('Error during upload process:', error);
      res.status(500).json({ error: 'Failed to upload file.' });
    }
  }
);

router.get(
  '/',
  keycloak.protect('realm:user'),
  async (req: KeycloakRequest, res) => {
    const userId = req.kauth.grant.access_token.content.sub;
    try {
      const avatar = await Storage.findOne({
        where: {
          externalId: userId,
          entityType: 'user',
        },
      });
      const signedUrl = new URL(
        await client.presignedUrl(
          'GET',
          avatar.get('bucket'),
          avatar.get('path')
        )
      );

      const url = `${signedUrl.origin}${signedUrl.pathname}`;
      res.json({ ...avatar.dataValues, url });
    } catch (error) {
      console.error('Error retrieving medias:', error);
      res.status(500).json({ message: 'Failed to retrieve post medias' });
    }
  }
);

router.get('/:userId', keycloak.protect('realm:service'), async (req, res) => {
  const userId = req.params.userId;
  try {
    const avatar = await Storage.findOne({
      where: {
        externalId: userId,
        entityType: 'user',
      },
    });

    if (!avatar) return res.status(404).json({ message: 'Avatar not found' });

    const signedUrl = new URL(
      await client.presignedUrl('GET', avatar.get('bucket'), avatar.get('path'))
    );
    const url = `${signedUrl.origin}${signedUrl.pathname}`;

    res.json({ ...avatar.dataValues, url });
  } catch (error) {
    console.error('Error retrieving avatar:', error);
    res.status(500).json({ message: 'Failed to retrieve post medias' });
  }
});

router.delete(
  '/',
  keycloak.protect('realm:user'),
  async (req: KeycloakRequest, res) => {
    try {
      const storage = await Storage.findOne({
        where: {
          externalId: req.kauth.grant.access_token.content.sub,
          entityType: 'user',
        },
      });

      if (!storage)
        return res.status(404).json({ message: 'Storage not found' });

      const deleted = await deleteFileFromMinio(storage);
      if (!deleted)
        return res
          .status(500)
          .json({ message: 'Failed to delete avatar file' });
      await storage.destroy();
      await cache.del(`avatar:${req.kauth.grant.access_token.content.sub}`);
      res.status(204).send(); // No content response
    } catch (error) {
      console.error('Error deleting storage:', error);
      res.status(500).json({ message: 'Failed to delete avatar storage' });
    }
  }
);

export default router;
