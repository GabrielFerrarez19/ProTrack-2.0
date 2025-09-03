"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/", auth_controller_1.login); // POST /login
router.post("/create", auth_controller_1.createUserController);
exports.default = router;
