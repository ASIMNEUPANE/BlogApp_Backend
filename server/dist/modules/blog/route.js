"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const zod_1 = require("zod");
const router = express_1.default.Router();
const blogSchemaValidator = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    content: zod_1.z.string().min(1),
    author: zod_1.z.string().min(1),
    totalWord: zod_1.z.number().min(1),
});
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, totalWord } = blogSchemaValidator.parse(req.body);
        const result = yield controller_1.default.create(req.body);
        res.status(200).json({ data: result, msg: 'Success' });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: "invalid data", details: error.errors });
        }
        else {
            next(error);
        }
    }
}));
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (_a) { }
}));
exports.default = router;
