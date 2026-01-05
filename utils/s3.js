const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.region,
});

module.exports = s3;
