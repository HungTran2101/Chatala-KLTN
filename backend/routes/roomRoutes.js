const express = require('express');
const authMiddleware = require('../middlewares/auth');
const {
  getRoomList,
  getRoomInfo,
  changeRoomName,
  setNickname,
  addMember,
  createRoom,
  increaseUnreadMsg,
  userSeenRoom,
  kickMember,
  roomStartCall,
  roomEndCall,
} = require('../controllers/roomController');

const router = express.Router();

router.route('/').get(authMiddleware, getRoomList);
router.route('/').post(authMiddleware, createRoom);
router.route('/:roomId').get(authMiddleware, getRoomInfo);
router.route('/:roomId/change-name').put(authMiddleware, changeRoomName);
router.route('/:roomId/nickname').put(authMiddleware, setNickname);
router.route('/:roomId/add-member').put(authMiddleware, addMember);
router.route('/:roomId/kick-member').put(authMiddleware, kickMember);
router.route('/inc').post(authMiddleware, increaseUnreadMsg);
router.route('/seen').post(authMiddleware, userSeenRoom);
router.route('/startCall').post(authMiddleware, roomStartCall);
router.route('/endCall').post(authMiddleware, roomEndCall);

module.exports = router;
