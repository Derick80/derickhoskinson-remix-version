import { writeAsyncIterableToWritable } from '@remix-run/node'
import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

type UploadImageToCloudinary = {
  data: AsyncIterator<Uint8Array>
  filename?: string
}

const uploadImageToCloudinary = async ({
  data,
  filename
}: UploadImageToCloudinary): Promise<cloudinary.UploadApiResponse> => {
  const uploadPromise = await new Promise<cloudinary.UploadApiResponse>(
    (resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'Me',
          filename_override: __filename,
          discard_original_filename: false,
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          transformation: [{ quality: 'auto' }]
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result as cloudinary.UploadApiResponse)
          }
        }
      )
      writeAsyncIterableToWritable(
        {
          [Symbol.asyncIterator]: () => data
        },
        uploadStream
      )
    }
  )

  return uploadPromise
}



export { uploadImageToCloudinary }

