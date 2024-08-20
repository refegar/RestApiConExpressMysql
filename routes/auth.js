const express = require('express');
const { register, contacto} = require("../controller/auth-controller");

const router = express.Router();

router.post("/register", register);
router.post("/contacto", contacto);

module.exports = router;
