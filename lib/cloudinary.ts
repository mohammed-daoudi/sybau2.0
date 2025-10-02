import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(
  file: File,
  options: {
    folder?: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
    allowedFormats?: string[];
    transformation?: any[];
  } = {}
) {
  const {
    folder = 'products',
    resourceType = 'auto',
    allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'glb', 'gltf'],
    transformation = []
  } = options;

  // Convert file to base64
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const fileType = file.type.split('/')[1];
  const dataURI = `data:${file.type};base64,${base64}`;

  // Verify file format
  if (!allowedFormats.includes(fileType.toLowerCase())) {
    throw new Error(`Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`);
  }

  try {
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: resourceType,
      allowed_formats: allowedFormats,
      transformation,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  } catch (error: any) {
    throw new Error(`Upload failed: ${error.message}`);
  }
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error: any) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}