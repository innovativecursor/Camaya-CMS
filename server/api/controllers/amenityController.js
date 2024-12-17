const Amenity = require("../models/amenities");
const Menu = require("../models/menu");
const cloudinary = require("../../utils/cloudinary");
const { formattedResult } = require("../utils/Consts");
const { Op, Sequelize } = require("sequelize");

exports.getMenuOptions = async (req, res) => {
  try {
    const menus = await Menu.findAll({
      attributes: ["menu_id", "menu_name"],
      // include: [
      //   {
      //     model: Amenity,
      //     as: "Amenities", // Use the alias from the association
      //     attributes: ["amenity_name", "amenity_desc", "pictures"],
      //   },
      // ],
      order: [["menu_name", "ASC"]],
    });

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch menus with amenities",
      error: error.message,
    });
  }
};
exports.getAmenitiesByMenuId = async (req, res) => {
  try {
    const { menu_id } = req.query;

    //#region Returning Amenities
    // Fetch aminities along with menu_name
    // const aminities = await Amenity.findAll({
    //   where: { menu_id },
    //   include: {
    //     model: Menu,
    //     attributes: ["menu_name", "menu_id"], // Fetch menu_name from Menu model
    //   },
    //   attributes: ["amenity_name", "amenity_desc", "pictures"], // Only fetch relevant amenity fields
    // });
    // const result = formattedResult(aminities);
    // res.status(200).json(result);
    //#endregion
    //#region Returing distinct Amenities
    const distinctAmenities = await Amenity.findAll({
      where: { menu_id },
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("amenity_name")),
          "amenity_name",
        ],
      ],
    });

    res.status(200).json(distinctAmenities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch aminities", error: error.message });
  }
};
exports.getAmenities = async (req, res) => {
  try {
    const findAll = await Amenity.findAll({
      include: {
        model: Menu,
        attributes: ["menu_name", "menu_id"], // Fetch menu_name from Menu model
      },
      attributes: ["amenity_id", "amenity_name", "amenity_desc", "pictures"],
    });
    const result = formattedResult(findAll);
    res.status(200).json({ result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch Amenities", error: error.message });
  }
};
exports.createAmenity = async (req, res) => {
  try {
    const { menu_name, amenity_name, amenity_desc, pictures } = req.body;

    // Check if the menu already exists (case-insensitive)
    let menu = await Menu.findOne({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("menu_name")), // Convert column value to lowercase
        menu_name.toLowerCase() // Convert input to lowercase
      ),
    });

    // If menu doesn't exist, create a new menu
    if (!menu) {
      menu = await Menu.create({ menu_name });
    }

    // Create the new Amenity
    const newAmenity = await Amenity.create({
      amenity_name,
      amenity_desc,
      pictures: [],
      menu_id: menu.menu_id, // Use the menu_id from the created/found menu
    });
    // Generate a unique folder name using the property ID
    const folderName = `${process.env.CLOUDINARY_DB}/Amenities_${newAmenity.amenity_id}`;

    // Upload pictures to Cloudinary
    const uploadPromises = pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName, // Specify the folder for uploaded images
      });
    });

    const uploadedImages = await Promise.all(uploadPromises || []);

    // Update the property with the uploaded images
    await newAmenity.update({ pictures: uploadedImages });
    res.status(201).json({
      message: "Amenity created successfully",
      newAmenity,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create Amenity",
      error: error.message,
    });
  }
};
exports.updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_name, amenity_name, amenity_desc, pictures } = req.body;

    // Find the existing Amenity by id
    const amenity = await Amenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    // Check if the menu_name exists or create a new one
    let menu = await Menu.findOne({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("menu_name")),
        menu_name.toLowerCase()
      ),
    });

    if (!menu) {
      menu = await Menu.create({ menu_name });
    }

    // Prepare folder for Cloudinary images
    const folderName = `${process.env.CLOUDINARY_DB}/Amenities_${id}`;

    // Fetch existing Cloudinary images
    const cloudinaryFiles = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
    });
    const cloudinaryPublicIds = cloudinaryFiles.resources.map(
      (file) => file.public_id
    );

    // Identify pictures to keep and delete
    const updatedPublicIds = pictures
      .map((pic) => pic.public_id)
      .filter(Boolean); // Keep only valid public_ids
    const deletePromises = cloudinaryPublicIds
      .filter((publicId) => !updatedPublicIds.includes(publicId))
      .map((publicId) => cloudinary.uploader.destroy(publicId));
    await Promise.all(deletePromises);

    // Upload new base64 images to Cloudinary
    const uploadPromises = pictures
      .filter((pic) => typeof pic === "string")
      .map((base64Data) =>
        cloudinary.uploader.upload(base64Data, { folder: folderName })
      );

    const uploadedImages = await Promise.all(uploadPromises);

    // Merge existing images with newly uploaded images
    const allImages = [
      ...pictures.filter((pic) => typeof pic !== "string"), // Existing images
      ...uploadedImages, // Newly uploaded images
    ];

    // Update the Amenity with new data
    amenity.menu_id = menu.menu_id; // Update menu_id based on menu_name
    amenity.amenity_name = amenity_name || amenity.amenity_name;
    amenity.amenity_desc = amenity_desc || amenity.amenity_desc;
    amenity.pictures = allImages;

    await amenity.save();
    deleteUnusedMenus();
    res.status(200).json({
      message: "Amenity updated successfully",
      amenity,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update Amenity",
      error: error.message,
    });
  }
};
exports.deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the amenity by ID
    const amenity = await Amenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    // Extract the pictures array from the amenity
    const { pictures } = amenity;

    // If there are pictures, proceed with deleting them from Cloudinary
    if (pictures && pictures.length > 0) {
      const folderName = pictures[0]?.folder;

      // Delete all pictures associated with the amenity
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

    // Delete the amenity from the database
    await amenity.destroy();
    deleteUnusedMenus();
    res.status(200).json({ message: "Amenity deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete amenity", error: error.message });
  }
};
const deleteUnusedMenus = async () => {
  try {
    // Find all Menu IDs that have no associated Projects
    const unusedMenus = await Menu.findAll({
      include: [
        {
          model: Project,
          attributes: [], // No need to fetch Project data
          required: false, // LEFT JOIN: Include even if no Projects exist
        },
      ],
      where: {
        "$Projects.project_id$": { [Op.is]: null }, // Check where no Projects are associated
      },
    });

    // Extract unused Menu IDs
    const unusedMenuIds = unusedMenus.map((menu) => menu.menu_id);

    if (unusedMenuIds.length > 0) {
      // Delete unused Menu records
      await Menu.destroy({
        where: {
          menu_id: { [Op.in]: unusedMenuIds },
        },
      });
      console.log(`Deleted unused Menus: ${unusedMenuIds.join(", ")}`);
    } else {
      console.log("No unused Menus to delete.");
    }
  } catch (error) {
    console.error("Error deleting unused Menus:", error.message);
  }
};
