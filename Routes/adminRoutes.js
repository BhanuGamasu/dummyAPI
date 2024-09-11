const adminRoutes = require("express").Router();

const { adminController } = require("../Controllers/adminController");

adminRoutes.post("/saveUserData", adminController.saveUserData);
adminRoutes.get("/getUserData", adminController.getUserData);
adminRoutes.put("/updateUserData", adminController.updateUserData);

module.exports = adminRoutes;
