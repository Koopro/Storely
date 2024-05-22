const express = require('express');
const router = express.Router();
const { listsget, listspost, listid, todospost, todosget } = require('../controllers/todoController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/todo/lists', authMiddleware, listspost);
router.get('/todo/lists', authMiddleware, listsget);
router.delete('/todo/lists/:id', authMiddleware, listid);

router.post('/todos', authMiddleware, todospost);
router.get('/todos', authMiddleware, todosget);


module.exports = router;
