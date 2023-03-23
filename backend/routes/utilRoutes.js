const express = require("express");
const { signedKey } = require("../controllers/utilControllers");
const authMiddleware = require("../middlewares/auth");
const Messages = require("../models/messageModel");
const Rooms = require("../models/roomModel");

const router = express.Router();

router.route("/signedKey").post(authMiddleware, signedKey);
router.route("/test").get(async (req, res, next) => {});
module.exports = router;

//hung2: 6372476fa2f6d6d3ea49259b
//hung: 63724ac38d855015f2372cad
