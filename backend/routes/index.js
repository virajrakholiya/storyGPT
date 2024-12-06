var express = require("express");
var router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/auth");
/* GET home page. */
router.post("/", auth, chatController.chat);

module.exports = router;
