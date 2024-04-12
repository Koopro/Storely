const express = require('express');
const router = express.Router();
const { requestFriendship, acceptFriendship, blockUser, listFriends, listPendingFriendRequests, removeFriendship } = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request', authMiddleware, requestFriendship);
router.post('/accept', authMiddleware, acceptFriendship);
router.post('/block', authMiddleware, blockUser);
router.get('/list', authMiddleware, listFriends);
router.get('/pending', authMiddleware, listPendingFriendRequests);
router.post('/remove', authMiddleware, removeFriendship);


module.exports = router;
