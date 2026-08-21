const express = require("express");
const router = express.Router();
const { listMessages, sendMessage } = require("../controllers/messagesController");
const { requireAuth } = require("../middleware/auth");

// GET  /api/claims/:id/messages  -> full thread for a claim
router.get("/:id/messages", requireAuth, listMessages);

// POST /api/claims/:id/messages  -> send a message on a claim
router.post("/:id/messages", requireAuth, sendMessage);

module.exports = router;