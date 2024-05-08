const express = require('express');
const router = express.Router();
const { listsget, listspost, listid } = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/lists', authMiddleware, listspost);
router.get('/lists', authMiddleware, listsget);
router.delete('/lists/:id', authMiddleware, listid);

module.exports = router;
