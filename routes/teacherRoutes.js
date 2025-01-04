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
const upload = require("../middleware/uploadMiddleware")
const imageUpload = require("../middleware/imageUpload")
const { authenticate, isTeacher } = require("../middleware/authenticate")

const router = express.Router();

// Login route for teachers
router.post("/login", teacherController.teacherLogin);

// Create a new student (only accessible to authenticated teachers)
router.post("/students/add", authenticate, isTeacher, teacherController.createStudent);

// Get all students in a class (only accessible to authenticated teachers)
router.get("/students/:className", authenticate, isTeacher, teacherController.getAllStudents);

// Get student details by ID (only accessible to authenticated teachers)
router.get("/students/:studentId", authenticate, isTeacher, teacherController.getStudentById);

// Update student details (only accessible to authenticated teachers)
router.put("/students/:studentId", authenticate, isTeacher, teacherController.updateStudent);

// Delete a student (only accessible to authenticated teachers)
router.delete("/students/:studentId", authenticate, isTeacher, teacherController.deleteStudent);

// Create a Cw (only accessible to authenticated teachers)
router.post("/classwork/upload", authenticate, isTeacher, upload.single("file"), classworkController.uploadClasswork);

// Get Cw in a class (only accessible to authenticated teachers)
router.get("/classwork/:className", authenticate, isTeacher, classworkController.getAllClassworkByClass);

// Update Cw (only accessible to authenticated teachers)
router.put("/classwork/:id",authenticate, isTeacher, upload.single("file"), classworkController.updateClasswork);

// Delete a Cw (only accessible to authenticated teachers)
router.delete("/classwork/:id", authenticate, isTeacher, classworkController.deleteClasswork);

// Create a Hw (only accessible to authenticated teachers)
router.post("/homework/upload", authenticate, isTeacher, upload.single("file"), homeworkController.uploadHomework);

// Get Hw in a class (only accessible to authenticated teachers)
router.get("/homework/:className", authenticate, isTeacher, homeworkController.getAllHomeworkByClass);

// Update Hw (only accessible to authenticated teachers)
router.put("/homework/:id",authenticate, isTeacher, upload.single("file"), homeworkController.updateHomework);

// Delete a Hw (only accessible to authenticated teachers)
router.delete("/homework/:id", authenticate, isTeacher, homeworkController.deleteHomework);

// Create a Notice Pdf (only accessible to authenticated teachers)
router.post("/dpp/upload", authenticate, isTeacher, upload.single("file"), dppController.uploadDpp);

// Get Notice Pdf in a class (only accessible to authenticated teachers)
router.get("/dpp/:className", authenticate, isTeacher, dppController.getAllDppsByClass);

// Update Notice Pdf (only accessible to authenticated teachers)
router.put("/dpp/:id",authenticate, isTeacher, upload.single("file"), dppController.updateDpp);

// Delete a Notice Pdf (only accessible to authenticated teachers)
router.delete("/dpp/:id", authenticate, isTeacher, dppController.deleteDpp);

// Create a Library (only accessible to authenticated teachers)
router.post("/library/upload", authenticate, isTeacher, upload.single("file"), libraryController.uploadLibraryFile);

// Get Library in a class (only accessible to authenticated teachers)
router.get("/library/:className", authenticate, isTeacher, libraryController.getAllLibraryByClass);

// Update Library (only accessible to authenticated teachers)
router.put("/library/:id",authenticate, isTeacher, upload.single("file"), libraryController.updateLibraryFile);

// Delete a Library (only accessible to authenticated teachers)
router.delete("/library/:id", authenticate, isTeacher, dppController.deleteDpp);

// Create a Notice Pdf (only accessible to authenticated teachers)
router.post("/notice/pdf/upload", authenticate, isTeacher, upload.single("file"), noticePdfController.uploadNoticePdf);

// Get Notice Pdf in a class (only accessible to authenticated teachers)
router.get("/notice/pdf/:className", authenticate, isTeacher, noticePdfController.getAllNoticePdfsByClass);

// Update Notice Pdf (only accessible to authenticated teachers)
router.put("/notice/pdf/:id",authenticate, isTeacher, upload.single("file"), noticePdfController.updateNoticePdf);

// Delete a Notice Pdf (only accessible to authenticated teachers)
router.delete("/notice/pdf/:id", authenticate, isTeacher, noticePdfController.deleteNoticePdf);

// Create a Notice Pdf (only accessible to authenticated teachers)
router.post("/notice/image/upload", authenticate, isTeacher, imageUpload.single("file"), noticeImageController.uploadNoticeImage);

// Get Notice Pdf in a class (only accessible to authenticated teachers)
router.get("/notice/image/:className", authenticate, isTeacher, noticeImageController.getNoticeImagesByClass);

// Update Notice Pdf (only accessible to authenticated teachers)
router.put("/notice/image/:id",authenticate, isTeacher, imageUpload.single("file"), noticeImageController.updateNoticeImage);

// Delete a Notice Pdf (only accessible to authenticated teachers)
router.delete("/notice/image/:id", authenticate, isTeacher, noticeImageController.deleteNoticeImage);

// Get all diary images
router.get("/diary/:className", authenticate, isTeacher, diaryController.getDiaryByClass);

// Upload a new diary image
router.post("/diary/upload", authenticate, isTeacher, imageUpload.single("file"), diaryController.uploadDiaryImage);

// Update a diary image
router.put("/diary/:id", authenticate, isTeacher, imageUpload.single("file"), diaryController.updateDiaryImage);

// Delete a diary image
router.delete("/diary/:id", authenticate, isTeacher, diaryController.deleteDiaryImage);


// Admin uploaded get by teacher

router.get("/globalNoticeImage", AdminGlobalNoticeImageController.getAllGlobalImages); // Get all global notice images
router.get("/gallery", AdminGalleryController.getGallery); // Get all galleries

// Student uploaded get by teacher

router.get("/application/image/:className", applicationImageController.getAllApplicationsByClass); // Get all application texts
router.get("/application/text/:className", applicationTextController.getApplicationsByClass); // Get all application texts

module.exports = router;
