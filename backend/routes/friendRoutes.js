const express = require('express');
const authMiddleware = require('../middlewares/auth');
const {
  getFriendRequestList,
  friendReq,
  friendAccept,
  friendDecline,
  block,
  unblock,
  friendList,
  unfriend,
  checkFriend,
  friendListLimit,
  searchFriend,
  getNotiList,
  cancelRequest,
} = require('../controllers/friendControllers');

const router = express.Router();

router.route('/request').get(authMiddleware, getFriendRequestList);
router.route('/noti').get(authMiddleware, getNotiList);
router.route('/request/:id').post(authMiddleware, friendReq);
router.route('/accept/:id').post(authMiddleware, friendAccept);
router.route('/decline/:id').post(authMiddleware, friendDecline);
router.route('/cancel/:notificationId').post(authMiddleware, cancelRequest);
router.route('/block/:id').post(authMiddleware, block);
router.route('/unblock/:id').post(authMiddleware, unblock);
router.route('/unfriend/:id').post(authMiddleware, unfriend);
router.route('/check-friend').post(authMiddleware, checkFriend);
router.route('/').get(authMiddleware, friendList);
router.route('/limit/:limit/:pageNum').get(authMiddleware, friendListLimit);
router
  .route('/search/:search/:limit/:pageNum')
  .get(authMiddleware, searchFriend);

module.exports = router;
