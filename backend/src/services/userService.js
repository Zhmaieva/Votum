const {uploadImage, deleteImage} = require("../aws/s3");
const {updateProfileImage} = require("../db/dal/userQueries");

async function updateUserImage(file, userId) {
    const uploadResult = await uploadImage(file, userId);
    if (!uploadResult.url) {
        console.error(`upload failed for user_id [${userId}] : ${uploadResult.url}`);
        return;
    }

    let oldImageUrl;
    try {
        oldImageUrl = await updateProfileImage(uploadResult.url, userId);
    } catch (e) {
        console.error('image save failed for user_id [${userId}] : ${uploadResult.url}');
        return;
    }

    try {
        await deleteImage(oldImageUrl);
    } catch (e) {
        console.error(`delete failed for user_id [${userId}] : ${oldImageUrl}`);
        return;
    }

    console.info(`image saved for user_id [${userId}]`);
}

module.exports = {
    updateUserImage
}