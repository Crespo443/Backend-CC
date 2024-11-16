const express = require('express');
const router = express.Router();
const asycnHandler = require('express-async-handler');
const { createChat, addMessageToChat, getChatMessageById } = require('../controllers/chatController')

const protectRoute = require('../middleware/authMiddleware')


router.post('/', protectRoute, asycnHandler(createChat))
router.post('/:chatId', protectRoute, asycnHandler(addMessageToChat))
router.get('/:chatId',protectRoute,  asycnHandler(getChatMessageById))


module.exports = router