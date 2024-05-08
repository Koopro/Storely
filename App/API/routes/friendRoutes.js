const express = require('express');
const router = express.Router();
const { requestFriendship, acceptFriendship, blockUser, listFriends, listSentFriendRequests, listPendingFriendRequests, removeFriendship } = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request', authMiddleware, requestFriendship);
router.post('/accept', authMiddleware, acceptFriendship);
router.post('/block', authMiddleware, blockUser);
router.get('/list', authMiddleware, listFriends);
router.get('/pending', authMiddleware, listPendingFriendRequests);
router.post('/remove', authMiddleware, removeFriendship);
router.get('/sentrequests', authMiddleware, listSentFriendRequests);


module.exports = router;
