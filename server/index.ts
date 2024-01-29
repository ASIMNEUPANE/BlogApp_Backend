import express from "express"
const app = express();
const PORT= parseInt(process.env.PORT || "3333");
app.get("/", (req,res)=>{
    res.send("Hello me")
})
app.get("/hi", (req,res)=>{
    res.send("Hello world me and you")
})



app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
})