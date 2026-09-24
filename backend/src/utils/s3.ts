import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

export const uploadToS3 = async (bucketName: string, key: string, filePath: string) => {
  const fileStream = fs.createReadStream(filePath);
  
  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    return data;
  } catch (err) {
    console.error("Error uploading to S3:", err);
    throw err;
  }
};
