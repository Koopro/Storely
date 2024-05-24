const express = require('express');
const router = express.Router();
const { listsget, listspost, listdelete, todospost, todosget, todosput, tododelete } = require('../controllers/todoController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/todo/lists', authMiddleware, listspost);
router.get('/todo/lists', authMiddleware, listsget);
router.delete('/todo/lists/:id', authMiddleware, listdelete);

router.post('/todos', authMiddleware, todospost);
router.get('/todos', authMiddleware, todosget);
router.put('/todos/:id', authMiddleware, todosput);
router.delete('/todos/:id', authMiddleware, tododelete);

module.exports = router;
