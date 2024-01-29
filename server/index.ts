import express from "express"
const app = express();
const PORT= parseInt(process.env.PORT || "3333");
import  IndexRouter  from './routes/index';

app.use("/",IndexRouter);




app.get("/", (req,res)=>{
    res.send("Hello me")
})




app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
})