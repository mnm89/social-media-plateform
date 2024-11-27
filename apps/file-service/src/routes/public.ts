import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  deleteFileFromMinio,
  getFileTypeFromMimeType,
  uploadFileToMinio,
} from '../utils';
import { MinioConfig } from '@social-media-platform/common-config';
import { Storage } from '../models/storage';

const router = express.Router();
const upload = multer({ dest: 'assets/' });
const { client } = MinioConfig();

router.post('/files/upload', upload.single('file'), async (req, res) => {
  const { externalId, entityType } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file provided.' });
  }

  try {
    const storage = new Storage({
      entityType,
      externalId,
      type: getFileTypeFromMimeType(file.mimetype),
      bucket: process.env.MINIO_BUCKET_NAME,
    });

    const fileName = `${storage.get('id')}${path.extname(file.originalname)}`;
    storage.set('path', fileName);

    const uploaded = await uploadFileToMinio(file, storage, {
      'x-amz-meta-entityType': entityType,
      'x-amz-meta-externalId': externalId,
    });
    if (!uploaded) res.status(500).json({ error: 'Failed to upload file.' });
    await storage.save();
    res.status(201).json(storage);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});

router.get('/files', async (req, res) => {
  try {
    const storages = await Storage.findAll({
      where: {
        bucket: process.env.MINIO_BUCKET_NAME,
      },
    });
    res.status(200).json(storages);
  } catch (error) {
    console.error('Error get files request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
router.get('/files/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const storage = await Storage.findByPk(id);
    if (!storage) {
      return res.status(404).json({ message: 'Storage not found.' });
    }

    res.status(200).json(storage);
  } catch (error) {
    console.error('Error get file request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
router.delete('/files/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const storage = await Storage.findByPk(id);
    if (!storage) {
      return res.status(404).json({ message: 'Storage not found.' });
    }

    const deleted = await deleteFileFromMinio(storage);
    if (!deleted)
      return res.status(500).json({ message: 'Failed to delete file' });
    await storage.destroy();

    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting file request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
router.post('/files/signed-url', async (req, res) => {
  const { storageId } = req.body;

  try {
    const storage = await Storage.findByPk(storageId);
    if (!storage) {
      return res.status(404).json({ message: 'Storage not found.' });
    }
    const signedUrl = await client.presignedUrl(
      'GET',
      storage.get('bucket') as string,
      storage.get('path') as string,
      60 * 60 // Expiry time in seconds (e.g., 1 hour)
    );

    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error('Error signed url request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
export default router;
