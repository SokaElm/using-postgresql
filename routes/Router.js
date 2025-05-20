// routes/Router.js
const { Router } = require("express");
const Controller = require("../controllers/Controller");
const router = Router();

router.get("/", Controller.getUsernames);
router.get("/new", Controller.createUsernameGet);
router.post("/new", Controller.createUsernamePost);
router.get("/delete", Controller.deleteUsernameGet);

module.exports = router;
