import { Request, Response } from 'express';
import aws from 'aws-sdk';
import { STORAGE } from 'config/storage';

export const uploadFile = async (req: Request, res: Response) => {
  aws.config.update({
    accessKeyId: STORAGE.S3_ACCESS_KEY_ID,
    secretAccessKey: STORAGE.S3_SECRET_ACCESS_KEY,
    region: STORAGE.S3_BUCKET_REGION,
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();

  if (!req.query.file) {
    return res.status(400).json({
      role: res.locals.state.account.role,
      message: 'Missing file name',
      status: 'error',
    });
  }

  if (!req.query.type) {
    return res.status(400).json({
      role: res.locals.state.account.role,
      message: 'Missing file type',
      status: 'error',
    });
  }

  if (Array.isArray(req.query.file) || Array.isArray(req.query.type)) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      message: 'Multi-file upload not yet supported',
      status: 'error',
    });
  }

  const accountId = res.locals.state.account.account_id;

  const filetype = req.query.type as string;
  const videoOrImage = filetype.includes('image') ? 'image' : 'video';

  const formatFilename = (filename: string) => {
    const date = new Date().toLocaleDateString('en-CA');
    const randomString = Math.random().toString(36).substring(2, 7);
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${accountId}/${videoOrImage}s/${date}/${cleanFileName}-${randomString}`;
  };

  const post = s3.createPresignedPost({
    Bucket: STORAGE.S3_BUCKET,
    Fields: {
      key: formatFilename(req.query.file as string),
    },
    Expires: 30,
    Conditions: [
      ['content-length-range', 0, 5242880000], // up to 5 GB
      ['starts-with', '$Content-Type', `${videoOrImage}/`],
    ],
  });

  return res.status(200).json(post);
};
