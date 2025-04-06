const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

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
    let quality = 80;
    let output = buffer;

    while (output.length > 5 * 1024 * 1024 && quality > 10) {
        output = await sharp(buffer)
            .jpeg({ quality }) // or .png({ compressionLevel: 9 }) depending on type
            .toBuffer();
        quality -= 10;
    }

    return output;
};

/**
 * Compresses and uploads image to S3
 * @param file
 * @returns {Promise<{url: string?}>}
 */
async function uploadImage(file) {
    try {
        //const buffer = await compressImage(file.buffer);

        const ext = file.mimetype === 'image/png' ? 'png' : 'jpg';
        const fileName = `vote/profiles/${uuidv4()}.${ext}`;

        const uploadParams = {
            Bucket: 'storage.beampie.com',
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);

        const resultUrl = `https://${uploadParams.Bucket}/${uploadParams.Key}`;

        return { url: resultUrl }
    } catch (e) {
        console.error(e);
        return { };
    }
}

module.exports = {
    uploadImage,
}