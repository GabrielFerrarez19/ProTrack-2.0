"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmailAndPassword = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const findUserByEmailAndPassword = async (email, password) => {
    return await prisma_1.default.user.findFirst({
        where: {
            email,
            password, // ⚠️ não recomendado usar senha em texto puro
        },
    });
};
exports.findUserByEmailAndPassword = findUserByEmailAndPassword;
