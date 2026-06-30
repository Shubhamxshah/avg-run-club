import { v2 as cloudinary } from "cloudinary";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  return { cloudName, apiKey, apiSecret };
}

export function configureCloudinary() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

type UploadAvatarOptions = {
  userId: string;
  buffer: Buffer;
  mimeType: string;
};

export async function uploadAvatar({
  userId,
  buffer,
  mimeType,
}: UploadAvatarOptions) {
  const client = configureCloudinary();
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

  const result = await client.uploader.upload(dataUri, {
    folder: "avg-run-club/avatars",
    public_id: userId,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
    transformation: [
      { width: 512, height: 512, crop: "fill", gravity: "face" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });

  return result.secure_url;
}

export async function deleteAvatar(userId: string) {
  const client = configureCloudinary();

  await client.uploader.destroy(`avg-run-club/avatars/${userId}`, {
    invalidate: true,
    resource_type: "image",
  });
}
