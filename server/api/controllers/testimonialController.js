const Testimonial = require("../models/testimonials");
const cloudinary = require("../../utils/cloudinary");
const Joi = require("joi");
const { formattedThumbnails } = require("../utils/Consts");

// Define Joi schema
const testimonialSchema = Joi.object({
  reviewer_name: Joi.string().allow(null, ""), // Allows empty strings or null values
  review: Joi.string().required(),
  pictures: Joi.array().items(Joi.string().uri()).default([]).optional(), // Assuming pictures are an array of URLs
});
exports.getTestimonials = async (req, res) => {
  try {
    const testimonialsFetched = await Testimonial.findAll({});
    const result = formattedThumbnails(testimonialsFetched);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch Testimonials", error: error.message });
  }
};
exports.createTestimonial = async (req, res) => {
  // Validate request data against the schema
  const { error } = testimonialSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation Error", error: error.details[0].message });
  }
  try {
    const { company_name, reviewer_name, review, pictures } = req.body;

    // Generate a unique folder name using the testimonial
    const folderName = `${
      process.env.CLOUDINARY_DB
    }/testimonial${new Date().toISOString()}`;
    // If the pictures are not uploaded by the client
    if (pictures?.length != 0) {
      // Upload pictures to Cloudinary
      const uploadPromises = pictures?.map((base64Data) => {
        return cloudinary.uploader.upload(base64Data, {
          folder: folderName, // Specify the folder for uploaded images
        });
      });
      const uploadedImages = await Promise.all(uploadPromises);
      // Check if any image upload failed
      if (!uploadedImages || uploadedImages.length !== pictures.length) {
        return res.status(400).json({
          message: "Failed to upload one or more images to Cloudinary",
        });
      }

      // Creating a Testimonial
      const creation = await Testimonial.create({
        company_name,
        reviewer_name,
        review,
        pictures: [],
      });
      // Update the testimonial with the uploaded images
      await creation.update({ pictures: uploadedImages });
    } else {
      // Creating a Testimonial
      await Testimonial.create({
        company_name,
        reviewer_name,
        review,
        pictures: [],
      });
    }
    // Update the testimonial with the uploaded images
    res.status(200).json({ message: "Created Testimonial Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to Create Testimonial", error: error.message });
  }
};
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ message: "testimonial not found" });
    }

    // Extract the pictures array from the testimonial
    const { pictures } = testimonial;
    // If there are pictures, proceed with deleting them from Cloudinary
    if (pictures && pictures.length > 0) {
      const folderName = pictures[0]?.folder;

      // Delete all pictures associated with the staff member
      const deletePromises = pictures.map((picture) =>
        cloudinary.uploader.destroy(picture.public_id)
      );
      await Promise.all(deletePromises);

      // Check if there are any remaining files in the folder and delete them
      const filesInFolder = await cloudinary.api.resources({
        type: "upload",
        prefix: folderName,
      });

      const deleteFilePromises = filesInFolder.resources.map((file) =>
        cloudinary.uploader.destroy(file.public_id)
      );

      await Promise.all(deleteFilePromises);

      // Finally, delete the folder itself
      await cloudinary.api.delete_folder(folderName);
    }

    // Delete the testimonial from the database
    await testimonial.destroy();

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete testimonial", error: error.message });
  }
};
