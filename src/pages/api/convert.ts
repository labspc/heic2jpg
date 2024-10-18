import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'tmp');
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const file = files.file as formidable.File;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const jpgPath = path.join(process.cwd(), 'public', `${timestamp}.jpg`);

    try {
      // Convert to JPG
      await sharp(file.filepath).toFormat('jpg').toFile(jpgPath);

      // Clean up the temporary file
      fs.unlinkSync(file.filepath);

      res.status(200).json({
        jpgUrl: `//${req.headers.host}/${timestamp}.jpg`,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      res.status(500).json({ error: 'Error during conversion' });
    }
  });
}