const express = require("express");
const router = express.Router();

const {protect} = require('../middleware/auth.middleware');
const uploadResumeFile = require("../middleware/upload.middleware");

const {
    uploadAndAnalyzeResume,
    getMyResumes,
    deleteResume
} = require('../controllers/resume.controller');

router.post("/upload", protect, uploadResumeFile.single("resume"), uploadAndAnalyzeResume);
router.get("/my", protect, getMyResumes);
router.delete("/:id", protect, deleteResume);

module.exports = router;