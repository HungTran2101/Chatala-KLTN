const {
  getToken,
  createMeeting,
  validateMeeting,
} = require('../controllers/callController');
const express = require('express');

// const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.route('/get-token').get(getToken);
router.route('/create-meeting').post(createMeeting);
router.route('/validate-meeting/:meetingId').post(validateMeeting);

module.exports = router;
