const express = require('express');
const authMiddleware = require('../middlewares/auth');
const {
  checkUser,
  registerUser,
  loginUser,
  findUser,
  getLoggedUser,
  logoutUser,
  editUserInfo,
  editAvatar,
  findUserById,
  changePassword,
  resetPassword,
  changeLocale,
  seenNoti,
} = require('../controllers/userControllers');

const router = express.Router();

router.route('/checkUser').get(checkUser);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/getLoggedUser').get(authMiddleware, getLoggedUser);
router.route('/find').post(authMiddleware, findUser);
router.route('/find/:id').get(authMiddleware, findUserById);
router.route('/logout').get(authMiddleware, logoutUser);
router.route('/update').post(authMiddleware, editUserInfo);
router.route('/update/avatar').post(authMiddleware, editAvatar);
router.route('/update/password').post(authMiddleware, changePassword);
router.route('/reset-password').post(resetPassword);
router.route('/change-locale').put(authMiddleware, changeLocale);
router.route('/seenNoti').get(authMiddleware, seenNoti);

module.exports = router;
