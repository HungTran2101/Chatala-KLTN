const express = require("express");
const { sendMessage, unSendMessage, deleteMessage, saveFile, getFile } = require("../controllers/messageControllers");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.route("/").post(authMiddleware, sendMessage);
router.route("/savefile").post(authMiddleware, saveFile)
router.route("/getfile").post(authMiddleware, getFile)
router.route("/:msgId/unsend").put(authMiddleware, unSendMessage);
router.route("/:msgId/delete").delete(authMiddleware, deleteMessage);

module.exports = router;