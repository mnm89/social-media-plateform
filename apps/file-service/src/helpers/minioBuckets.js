/**
 * @type {import('minio').Client}
 */
const minioClient = require("../config/minio");
// Ensure the bucket exists
const buckets = [process.env.MINIO_BUCKET_NAME, "avatars", "medias"];

const publicPolicy = (bucketName) => ({
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: { AWS: ["*"] },
      Action: ["s3:GetBucketLocation", "s3:ListBucket"],
      Resource: [`arn:aws:s3:::${bucketName}`],
    },
    {
      Effect: "Allow",
      Principal: { AWS: ["*"] },
      Action: ["s3:GetObject"],
      Resource: [`arn:aws:s3:::${bucketName}/*`],
    },
  ],
});

async function ensureMinioBucket(bucketName) {
  // Ensure the bucket exists
  return new Promise((resolve, reject) =>
    minioClient.bucketExists(bucketName, (err, exists) => {
      if (err) reject(err);
      else if (!exists) {
        minioClient.makeBucket(bucketName, "", (err) => {
          if (err) reject(err);
          else resolve();
        });
      } else resolve();
    })
  );
}

async function ensureMinioBuckets(params) {
  await Promise.all(buckets.map(ensureMinioBucket));
  ensureBucketsPolicies();
}

async function ensureBucketsPolicies() {
  minioClient.setBucketPolicy(
    "avatars",
    JSON.stringify(publicPolicy("avatars")),
    (err) => {
      if (err) {
        return console.log("Error setting bucket policy:", err);
      }
      console.log(`public policy set successfully for bucket avatars`);
    }
  );
}
module.exports = {
  ensureMinioBucket,
  ensureMinioBuckets,
};
