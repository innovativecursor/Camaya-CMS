const cloudinary = require("../../utils/cloudinary");

// Format the fetched images to include only 'url', 'secure_url', and 'public_id'
exports.formattedResult = (result) => {
  const cleanResult = result.map((el) => {
    return {
      ...el.toJSON(),
      pictures: el.pictures.map((image) => ({
        url: image.url,
        secure_url: image.secure_url,
        public_id: image.public_id,
        folder: image.folder,
      })),
    };
  });
  return cleanResult;
};
exports.formattedThumbnails = (result) => {
  const cleanResult = result.map((el) => {
    return {
      ...el.toJSON(),
      pictures: el.pictures.map((image) => ({
        url: cloudinary.url(image?.public_id, {
          transformation: [
            { gravity: "face", height: 200, width: 200, crop: "thumb" },
            { radius: "max" },
            { fetch_format: "auto" },
          ],
        }),
        secure_url: cloudinary.url(image?.public_id, {
          transformation: [
            { gravity: "face", height: 200, width: 200, crop: "thumb" },
            { radius: "max" },
            { fetch_format: "auto" },
          ],
        }),
        public_id: image.public_id,
        folder: image.folder,
      })),
    };
  });
  return cleanResult;
};
exports.formattedDatePicResult = (result) => {
  const cleanResult = result.map((el) => {
    return {
      ...el.toJSON(),
      date: el.date.toISOString().split("T")[0],
      pictures: el.pictures.map((image) => ({
        url: image.url,
        secure_url: image.secure_url,
        public_id: image.public_id,
        folder: image.folder,
      })),
    };
  });
  return cleanResult;
};
