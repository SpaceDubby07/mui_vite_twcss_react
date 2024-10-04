import express, { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '../index';
import multer from 'multer';
import fs from 'fs';

// Setup multer
const upload = multer({ dest: 'uploads/' }); // Temporary folder for uploaded files
const router = express.Router();

cloudinary.config({
  cloud_name: 'dni5o6wig',
  api_key: '547354967185932',
  api_secret: 'Ztz723PEBSxWAQOKopGmSbxIye8',
});

router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM user_image_uploads', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Upload an image
router.post(
  '/',
  upload.single('image'),
  async (req: Request, res: Response) => {
    const { user_id } = req.body;

    // Validate that the user_id is a number
    const userIdNumber = Number(user_id);
    if (isNaN(userIdNumber)) {
      return res
        .status(400)
        .json({ error: 'user_id must be a valid number' });
    }

    // Make sure a file was uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'Image file is required' });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `mui_react/${userIdNumber}`,
        upload_preset: 'mui_react',
      });

      // Delete the local file after successful upload
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Failed to delete the temporary file:', err);
        }
      });

      const imageUrl = result.secure_url;
      db.run(
        `INSERT INTO user_image_uploads (user_id, image) VALUES (?, ?)`,
        [userIdNumber, imageUrl],
        function (err) {
          if (err) {
            return res
              .status(500)
              .json({ error: 'Database error: ' + err.message });
          }

          // Return the image URL and the new record ID (optional)
          res.json({
            id: this.lastID, // The ID of the newly inserted record
            url: imageUrl,
          });
        }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
);

// function to extract the public id which cloudinary needs for deletion
function extractPublicIdsFromUrls(imageUrls: string | string[]) {
  // Check if imageUrls is a single string or an array of strings
  const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

  // Extract the public IDs from the Cloudinary URLs
  return urls.map((imageUrl) => {
    // Extract the public ID from each URL
    const parts = imageUrl.split('/');
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split('.')[0]; // Get everything before the file extension
    return publicId;
  });
}

// delete a user image from the database, and matching image from cloudinary
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { image, user_id } = req.body;
  console.log('Request Body:', req.body);

  const publicIds = extractPublicIdsFromUrls(image);
  console.log(publicIds);

  try {
    // Step 2: Delete images from Cloudinary
    await cloudinary.api.delete_resources(
      publicIds.map((publicId) => `mui_react/${user_id}/${publicId}`), // Format with user_id and publicId
      {
        type: 'upload',
        resource_type: 'image',
      }
    );

    // Step 3: Delete the record from the database
    db.run(
      'DELETE FROM user_image_uploads WHERE id = ?',
      [id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          message:
            'Image deleted successfully from Cloudinary and database',
        });
      }
    );
  } catch (error) {
    console.error('Cloudinary Deletion Error:', error);
    res
      .status(500)
      .json({ error: 'Failed to delete image from Cloudinary' });
  }
});

// DEVELOPMENT ONLY
// in case i need to delete a db entry during testing
router.delete('/del/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  db.run(
    'DELETE FROM user_image_uploads WHERE id = ?',
    [id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Image deleted successfully' });
    }
  );
});

export default router;
