const { S3Client, PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const bucketName = 'storage.beampie.com';

// Configure AWS S3
const s3 = new S3Client({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // set in .env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1', // change as needed
});

/**
 * Helper to compress image under 5 MB
 * @param buffer
 * @returns {Promise<Buffer<ArrayBufferLike>>}
 */
const compressImage = async (buffer) => {
    let quality = 20;
    let output = buffer;

    output = await sharp(buffer)
        .rotate()
        .jpeg({ quality }) // or .png({ compressionLevel: 9 }) depending on type
        .toBuffer();

    return output;
};

/**
 * Compresses and uploads image to S3
 * @param file
 * @param userId
 * @returns {Promise<{url: string?}>}
 */
async function uploadImage(file, userId) {
    try {
        const buffer = await compressImage(file.buffer);

        const ext = file.mimetype === 'image/png' ? 'png' : 'jpg';
        const fileName = `vote/profiles/${userId}___${uuidv4()}.${ext}`;

        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);

        const resultUrl = `https://${uploadParams.Bucket}/${uploadParams.Key}`;
        console.log(`Image ${resultUrl} uploaded successfully.`);

        return { url: resultUrl }
    } catch (e) {
        console.error(e);
        return { };
    }
}

/**
 * Deletes an image from S3 given its URL.
 * @param {string} imageUrl - The URL of the image to be deleted.
 * @returns {Promise<boolean>} - Returns true if the deletion was successful, otherwise false.
 */
async function deleteImage(imageUrl) {
    try {
        // Extract the bucket name and key from the URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        const deleteParams = {
            Bucket: bucketName,
            Key: `vote/profiles/${fileName}`,
        };

        const command = new DeleteObjectCommand(deleteParams);
        await s3.send(command);

        console.log(`Image ${imageUrl} deleted successfully.`);
        return true;  // Return true to indicate success
    } catch (e) {
        console.error(`Error deleting image: ${imageUrl}`, e);
        return false;  // Return false in case of an error
    }
}

module.exports = {
    uploadImage,
    deleteImage
}