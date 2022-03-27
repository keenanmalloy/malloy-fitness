import { Request, Response } from "express";
import aws from "aws-sdk";
import { STORAGE } from "config/storage";

export const uploadFile = async (req: Request, res: Response) => {
  aws.config.update({
    accessKeyId: STORAGE.S3_ACCESS_KEY_ID,
    secretAccessKey: STORAGE.S3_SECRET_ACCESS_KEY,
    region: STORAGE.S3_BUCKET_REGION,
    signatureVersion: "v4",
  });

  const s3 = new aws.S3();
  const post = s3.createPresignedPost({
    Bucket: STORAGE.S3_BUCKET,
    Fields: {
      key: req.query.file,
    },
    Expires: 60,
    Conditions: [
      ["content-length-range", 0, 5242880000], // up to 5 GB
    ],
  });

  return res.status(200).json(post);
};
