const express = require('express');
const router = express.Router();
const { listsget, listspost, listid, createTodo, getTodosByList, todoid } = require('../controllers/todoController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/lists', authMiddleware, listspost);
router.get('/lists', authMiddleware, listsget);
router.delete('/lists/:id', authMiddleware, listid);

router.post('/todos', authMiddleware, createTodo);
router.get('/todos/:listId', authMiddleware, getTodosByList);

module.exports = router;
