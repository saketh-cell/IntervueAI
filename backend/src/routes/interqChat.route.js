const express = require("express");
const router = express.Router();

const {protect} = require("../middleware/auth.middleware");
const controller = require("../controllers/interqChat.controller");

router.get("/history", protect, controller.getHistory);
router.post("/stream", protect, controller.streamChat);

module.exports = router;