"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "3333");
const index_1 = __importDefault(require("./routes/index"));
app.use("/", index_1.default);
app.get("/", (req, res) => {
    res.send("Hello me");
});
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});
