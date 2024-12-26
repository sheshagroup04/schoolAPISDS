const express = require("express");
const { authenticate } = require("../middleware/authenticate");
const { isAdmin } = require("../middleware/roleCheck");
const AdminTeacherController = require("../controllers/adminController");
const AdminGlobalNoticeImageController = require("../controllers/globalNoticeImage");
const AdminGalleryController = require("../controllers/galleryController");

const uploadImage = require("../middleware/imageUpload");
// Multer middleware for multiple file uploads
const galleryUpload = uploadImage.array("images", 5); // Maximum of 15 images

const router = express.Router();

// login
router.post("/login", AdminTeacherController.login);
// Middleware for authentication and admin role check
router.use(authenticate, isAdmin);

// Teacher CRUD operations managed by Admin
router.post("/teachers", AdminTeacherController.createTeacher); // Create a new teacher
router.get("/teachers", AdminTeacherController.getAllTeachers); // Get all teachers
router.get("/teachers/:id", AdminTeacherController.getTeacherById); // Get a teacher by ID
router.put("/teachers/:id", AdminTeacherController.updateTeacher); // Update a teacher
router.delete("/teachers/:id", AdminTeacherController.deleteTeacher); // Delete a teacher

// Global Notice Image CRUD operations managed by Admin
router.post("/globalNoticeImage/upload", uploadImage.single("file"), AdminGlobalNoticeImageController.uploadGlobalImage); // Upload a global notice image
router.get("/globalNoticeImage", AdminGlobalNoticeImageController.getAllGlobalImages); // Get all global notice images
router.put("/globalNoticeImage/:id", uploadImage.single("file"), AdminGlobalNoticeImageController.updateGlobalImage); // Update a global notice image
router.delete("/globalNoticeImage/:id", AdminGlobalNoticeImageController.deleteGlobalImage); // Delete a global notice image

// Gallery CRUD operations managed by Admin
router.post("/gallery/upload", galleryUpload, AdminGalleryController.uploadGallery); // Upload a gallery
router.get("/gallery", AdminGalleryController.getGallery); // Get all galleries
router.put("/gallery/:id", galleryUpload, AdminGalleryController.updateGallery); // Update a gallery
router.delete("/gallery/:id", AdminGalleryController.deleteGallery); // Delete a gallery




module.exports = router;