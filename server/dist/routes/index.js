"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_api_1 = __importDefault(require("./routes.api"));
const router = express_1.default.Router();
router.get('/routes', (req, res) => {
    res.send('Hello world me and you');
});
router.use('/api/v1', routes_api_1.default);
exports.default = router;
