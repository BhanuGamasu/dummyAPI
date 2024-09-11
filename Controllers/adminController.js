const curdOperations = require("../Models/curdOperations");
const { ObjectId } = require("mongodb"); // Import ObjectId for MongoDB

const adminController = {
  saveUserData: async (req, res) => {
    try {
      const { name, mobile } = req.body;
      if (!name || !mobile) {
        return res
          .status(400)
          .json({ success: false, message: "Name and mobile are required." });
      }
      const result = await curdOperations.insertOne(req.db, "users", {
        name,
        mobile,
      });
      if (result) {
        return res
          .status(200)
          .json({ success: true, message: "User data saved successfully." });
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Failed to save user data." });
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },

  getUserData: async (req, res) => {
    try {
      const { id } = req.query;

      // Check if the id is provided
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required." });
      }

      // Validate if the id is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user ID." });
      }

      // Find the user by _id
      const user = await curdOperations.findOne(req.db, "users", {
        _id: new ObjectId(id), // Cast id to ObjectId for MongoDB query
      });

      // If user is found, return the user data
      if (user) {
        return res.status(200).json({ success: true, data: user });
      } else {
        // If user not found, return a 404 response
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },

  updateUserData: async (req, res) => {
    try {
      const { id, name, mobile } = req.body;

      console.log("Request Data:", { id, name, mobile });

      if (!id || (!name && !mobile)) {
        return res.status(400).json({
          success: false,
          message: "ID and at least one field to update are required.",
        });
      }

      const filter = { _id: new ObjectId(id) };
      const updateObject = {};
      if (name) updateObject.name = name;
      if (mobile) updateObject.mobile = mobile;

      if (Object.keys(updateObject).length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No fields to update." });
      }

      const upsert = false;
      const result = await curdOperations.updateOne(
        req.db,
        "users",
        filter,
        updateObject,
        upsert
      );
      res.status(200).json({
        success: true,
        message: "User data updated successfully.",
        data: result,
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = { adminController };
