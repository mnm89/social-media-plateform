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
} from '@social-media-platform/common-config';
import { Storage } from '../models/storage';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const { client } = MinioConfig();
const { keycloak } = KeycloakSessionConfig();

router.post(
  '/:postId',
  keycloak.protect('realm:user'),
  upload.single('file'),
  async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file provided.' });

    try {
      const storage = new Storage({
        entityType: 'post',
        externalId: req.params.postId,
        type: getFileTypeFromMimeType(file.mimetype),
        bucket: 'medias',
      });
      const fileName = `${storage.get('id')}${path.extname(file.originalname)}`;
      storage.set('path', `${req.params.postId}/${fileName}`);

      const uploaded = await uploadFileToMinio(file, storage, {
        'x-amz-meta-postId': req.params.postId,
      });
      if (!uploaded) res.status(500).json({ error: 'Failed to upload file.' });

      await storage.save();
      res.status(201).json(storage);
    } catch (error) {
      console.error('Error during upload process:', error);
      res.status(500).json({ error: 'Failed to upload file.' });
    }
  }
);

router.get(
  '/:postId',
  keycloak.protect((token) => {
    return token.hasRole('realm:user') || token.hasRole('realm:service');
  }),
  async (req, res) => {
    try {
      const medias = await Storage.findAll({
        where: {
          externalId: req.params.postId,
          entityType: 'post',
        },
        order: [['createdAt', 'ASC']],
      });

      const signedMedias = await Promise.all(
        medias.map(async (storage) => {
          const signedUrl = await client.presignedUrl(
            'GET',
            storage.get('bucket'),
            storage.get('path'),
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
      console.error('Error retrieving medias:', error);
      res.status(500).json({ message: 'Failed to retrieve post medias' });
    }
  }
);

router.delete(
  '/:storageId',
  keycloak.protect('realm:user'),
  async (req, res) => {
    try {
      const storage = await Storage.findByPk(req.params.storageId);

      if (!storage)
        return res.status(404).json({ message: 'Storage not found' });

      const deleted = await deleteFileFromMinio(storage);
      if (!deleted)
        return res.status(500).json({ message: 'Failed to delete media file' });

      await storage.destroy();

      res.status(204).send(); // No content response
    } catch (error) {
      console.error('Error destroying storage:', error);
      res.status(500).json({ message: 'Failed to delete storage' });
    }
  }
);

export default router;
