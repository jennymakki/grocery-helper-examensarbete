import { v2 as cloudinary } from "cloudinary";

// Configure with env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Upload a file (from FormData) to Cloudinary
 * @param {File} file
 * @returns {Promise<string>} URL of uploaded image
 */
export async function uploadToCloudinary(file) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await cloudinary.uploader.upload_stream({
    folder: "recipes",
  }, (error, result) => {
    if (error) throw error;
    return result;
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "recipes" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}