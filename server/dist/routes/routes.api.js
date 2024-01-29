"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const route_1 = __importDefault(require("../modules/blog/route"));
router.get('/', route_1.default);
router.get('/hi', (req, res) => {
    res.send('asim');
});
exports.default = router;
