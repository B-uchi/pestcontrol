const router = require("express").Router();
const { getDashboardStats, getUsersByRole, getActivityReport } = require("../controllers/adminController");
const authController = require("../controllers/authController");
const { registerCrop, updateCrop, getFarmerCrops, getAllCrops, deleteCrop } = require("../controllers/cropController");
const { createPest, updatePest, getAllPests, deletePest } = require("../controllers/pestController");
const { protect, restrictTo } = require("../middleware/auth");


router.post("/register", authController.register);
router.post("/login", authController.login);

router.post(
  "/crops",
  protect,
  restrictTo("farmer"),
  registerCrop
);

router.put(
  "/crops/:cropId",
  protect,
  restrictTo("farmer"),
  updateCrop
);

router.get(
  "/crops/farmer",
  protect,
  restrictTo("farmer"),
  getFarmerCrops
);

router.get(
  "/crops",
  protect,
  restrictTo("pestcontrol", "admin"),
  getAllCrops
);

router.delete(
  "/crops/:cropId",
  protect,
  restrictTo("farmer"),
  deleteCrop
);

// Pest routes
router.post(
  "/pests",
  protect,
  restrictTo("pestcontrol"),
  createPest
);

router.put(
  "/pests/:pestId",
  protect,
  restrictTo("pestcontrol"),
  updatePest
);

router.get("/pests", protect, getAllPests);

router.delete(
  "/pests/:pestId",
  protect,
  restrictTo("pestcontrol"),
  deletePest
);

router.get('/admin/stats', protect, restrictTo('admin'), getDashboardStats);
router.get('/admin/users/:role', protect, restrictTo('admin'), getUsersByRole);
router.get('/admin/reports/activity', protect, restrictTo('admin'), getActivityReport);

module.exports = router;
