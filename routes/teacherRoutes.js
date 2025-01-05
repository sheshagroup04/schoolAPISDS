const express = require("express")
const teacherController = require("../controllers/teacherController")
const classworkController = require("../controllers/classworkController")
const homeworkController = require("../controllers/homeworkController")
const dppController = require("../controllers/dppController")
const libraryController = require("../controllers/libraryController")
const noticePdfController = require("../controllers/noticePdfController")
const noticeImageController = require("../controllers/noticeImageController")
const diaryController = require("../controllers/diaryController");
const applicationImageController = require("../controllers/applicationImage");
const applicationTextController = require("../controllers/applicationText");
const AdminGlobalNoticeImageController = require("../controllers/globalNoticeImage");
const AdminGalleryController = require("../controllers/galleryController");
const authController = require("../controllers/authController");
const upload = require("../middleware/uploadMiddleware")
const imageUpload = require("../middleware/imageUpload")
const { authenticate, verifyAccessToken, isTeacher } = require("../middleware/authenticate")

const router = express.Router();

// Login route for teachers
router.post("/login",authenticate, teacherController.teacherLogin);
router.post("/refresh",authenticate, authController.refreshTokens);

// Middleware for authentication and admin role check
router.use(authenticate, verifyAccessToken, isTeacher);

// Create a new student (only accessible to authenticated teachers)
router.post("/students/add", teacherController.createStudent);

// Get all students in a class (only accessible to authenticated teachers)
router.get("/students/:className", teacherController.getAllStudents);

// Get student details by ID (only accessible to authenticated teachers)
router.get("/students/:studentId", teacherController.getStudentById);

// Update student details (only accessible to authenticated teachers)
router.put("/students/:studentId", teacherController.updateStudent);

// Delete a student (only accessible to authenticated teachers)
router.delete("/students/:studentId", teacherController.deleteStudent);

// Create a Cw (only accessible to authenticated teachers)
router.post("/classwork/upload", upload.single("file"), classworkController.uploadClasswork);

// Get Cw in a class (only accessible to authenticated teachers)
router.get("/classwork/:className", classworkController.getAllClassworkByClass);

// Update Cw (only accessible to authenticated teachers)
router.put("/classwork/:id", upload.single("file"), classworkController.updateClasswork);

// Delete a Cw (only accessible to authenticated teachers)
router.delete("/classwork/:id", classworkController.deleteClasswork);

// Create a Hw (only accessible to authenticated teachers)
router.post("/homework/upload", upload.single("file"), homeworkController.uploadHomework);

// Get Hw in a class (only accessible to authenticated teachers)
router.get("/homework/:className", homeworkController.getAllHomeworkByClass);

// Update Hw (only accessible to authenticated teachers)
router.put("/homework/:id", upload.single("file"), homeworkController.updateHomework);

// Delete a Hw (only accessible to authenticated teachers)
router.delete("/homework/:id", homeworkController.deleteHomework);

// Create a Notice Pdf (only accessible to authenticated teachers)
router.post("/dpp/upload", upload.single("file"), dppController.uploadDpp);

// Get Notice Pdf in a class (only accessible to authenticated teachers)
router.get("/dpp/:className", dppController.getAllDppsByClass);

// Update Notice Pdf (only accessible to authenticated teachers)
router.put("/dpp/:id", upload.single("file"), dppController.updateDpp);

// Delete a Notice Pdf (only accessible to authenticated teachers)
router.delete("/dpp/:id", dppController.deleteDpp);

// Create a Library (only accessible to authenticated teachers)
router.post("/library/upload", upload.single("file"), libraryController.uploadLibraryFile);

// Get Library in a class (only accessible to authenticated teachers)
router.get("/library/:className", libraryController.getAllLibraryByClass);

// Update Library (only accessible to authenticated teachers)
router.put("/library/:id", upload.single("file"), libraryController.updateLibraryFile);

// Delete a Library (only accessible to authenticated teachers)
router.delete("/library/:id", dppController.deleteDpp);

// Create a Notice Pdf (only accessible to authenticated teachers)
router.post("/notice/pdf/upload", upload.single("file"), noticePdfController.uploadNoticePdf);

// Get Notice Pdf in a class (only accessible to authenticated teachers)
router.get("/notice/pdf/:className", noticePdfController.getAllNoticePdfsByClass);

// Update Notice Pdf (only accessible to authenticated teachers)
router.put("/notice/pdf/:id", upload.single("file"), noticePdfController.updateNoticePdf);

// Delete a Notice Pdf (only accessible to authenticated teachers)
router.delete("/notice/pdf/:id", noticePdfController.deleteNoticePdf);

// Create a Notice Pdf (only accessible to authenticated teachers)
router.post("/notice/image/upload", imageUpload.single("file"), noticeImageController.uploadNoticeImage);

// Get Notice Pdf in a class (only accessible to authenticated teachers)
router.get("/notice/image/:className", noticeImageController.getNoticeImagesByClass);

// Update Notice Pdf (only accessible to authenticated teachers)
router.put("/notice/image/:id", imageUpload.single("file"), noticeImageController.updateNoticeImage);

// Delete a Notice Pdf (only accessible to authenticated teachers)
router.delete("/notice/image/:id", noticeImageController.deleteNoticeImage);

// Get all diary images
router.get("/diary/:className", diaryController.getDiaryByClass);

// Upload a new diary image
router.post("/diary/upload", imageUpload.single("file"), diaryController.uploadDiaryImage);

// Update a diary image
router.put("/diary/:id", imageUpload.single("file"), diaryController.updateDiaryImage);

// Delete a diary image
router.delete("/diary/:id", diaryController.deleteDiaryImage);

// Admin uploaded get by teacher
router.get("/globalNoticeImage", AdminGlobalNoticeImageController.getAllGlobalImages); // Get all global notice images
router.get("/gallery", AdminGalleryController.getGallery); // Get all galleries

// Student uploaded get by teacher
router.get("/application/image/:className", applicationImageController.getAllApplicationsByClass); // Get all application texts
router.get("/application/text/:className", applicationTextController.getApplicationsByClass); // Get all application texts

module.exports = router;