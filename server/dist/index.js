"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const PORT = parseInt(process.env.PORT || "3333");
const index_1 = __importDefault(require("./routes/index"));
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Blog';
mongoose_1.default.connect(DB_URL).then(() => {
    console.log("Database is connected");
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/", index_1.default);
app.use((err, req, res, next) => {
    const errMsg = err ? err.toString() : "Something went wrong";
    res.status(500).json({ data: "", msg: errMsg });
});
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});
