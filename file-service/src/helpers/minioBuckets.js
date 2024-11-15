/**
 * @type {import('minio').Client}
 */
const minioClient = require("../config/minio");
// Ensure the bucket exists
const buckets = [process.env.MINIO_BUCKET_NAME, "avatars", "medias"];

async function ensureMinioBucket(bucketName) {
  // Ensure the bucket exists
  return minioClient.bucketExists(bucketName, (err, exists) => {
    if (err) throw err;
    if (!exists) {
      minioClient.makeBucket(bucketName, "", (err) => {
        if (err) throw err;
        console.log(`Bucket "${bucketName}" created.`);
      });
    }
  });
}

async function ensureMinioBuckets(params) {
  return Promise.all(buckets.map(ensureMinioBucket));
}
module.exports = {
  ensureMinioBucket,
  ensureMinioBuckets,
};
