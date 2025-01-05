const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const applicationImageController = require("../controllers/applicationImage");
const applicationTextController = require("../controllers/applicationText");
const teacherController = require("../controllers/teacherController");

// CW, HW, DPP, Library, Notice PDF, Notice Image, Diary Read operations

const classworkController = require("../controllers/classworkController")
const homeworkController = require("../controllers/homeworkController")
const dppController = require("../controllers/dppController")
const libraryController = require("../controllers/libraryController")
const noticePdfController = require("../controllers/noticePdfController")
const noticeImageController = require("../controllers/noticeImageController")
const diaryController = require("../controllers/diaryController");
const AdminGlobalNoticeImageController = require("../controllers/globalNoticeImage");
const AdminGlobalNoticePdfController = require("../controllers/globalNoticePdf");
const AdminGalleryController = require("../controllers/galleryController");
const authController = require("../controllers/authController");

const { authenticate, verifyAccessToken, isStudent } = require("../middleware/authenticate");
const uploadImage = require("../middleware/imageUpload");

// Student login route
router.post("/login",authenticate, studentController.studentLogin);
router.post("/refresh",authenticate, authController.refreshTokens);

router.use(authenticate, verifyAccessToken, isStudent);

// Get student details by ID (only accessible to authenticated teachers)
router.get("/students/:studentId", teacherController.getStudentById);


// CW, HW, DPP, Library, Notice PDF, Notice Image, Diary Read operations managed by Student

router.get("/classwork/:className", classworkController.getAllClassworkByClass);
router.get("/homework/:className", homeworkController.getAllHomeworkByClass);
router.get("/dpp/:className", dppController.getAllDppsByClass);
router.get("/library/:className", libraryController.getAllLibraryByClass);
router.get("/notice/pdf/:className", noticePdfController.getAllNoticePdfsByClass);
router.get("/notice/image/:className", noticeImageController.getNoticeImagesByClass);
router.get("/diary/:className", diaryController.getDiaryByClass);
router.get("/globalNoticePdf", AdminGlobalNoticePdfController.getAllNoticePdfs); // Get all global notice images
router.get("/globalNoticeImage", AdminGlobalNoticeImageController.getAllGlobalImages); // Get all global notice images
router.get("/gallery", AdminGalleryController.getGallery); // Get all galleries


// Application Image CRUD operations managed by Student
router.post("/application/image/upload", uploadImage.single("file"), applicationImageController.uploadApplicationImage); // Create an application text
router.get("/application/image/:className", applicationImageController.getAllApplicationsByClass); // Get all application texts
router.put("/application/image/:id", uploadImage.single("file"), applicationImageController.updateApplicationImage); // Update an application text
router.delete("/application/image/:id", applicationImageController.updateApplicationImage); // Delete an application text

// Application Text CRUD operations managed by Student

router.post("/application/text/upload", applicationTextController.createApplication); // Create an application text
router.get("/application/text/:className", applicationTextController.getApplicationsByClass); // Get all application texts
router.put("/application/text/:id", applicationTextController.updateApplicationText); // Update an application text
router.delete("/application/text/:id", applicationTextController.deleteApplication); // Delete an application text





module.exports = router;
