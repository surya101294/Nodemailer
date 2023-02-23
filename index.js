const express = require("express")
const { connection } = require("./db")
const cors =require("cors")
const { userRouter } = require("./routes/user.routes")
require("dotenv").config()
const app = express()
app.use(cors())
app.use(express.json())


app.get("/",(req,res)=>{
    res.send({
        message:"Api is running",
        status:0,
        error:false
    })
}) 

//user route
app.use("/user",userRouter)




app.listen(process.env.PORT,async()=>{
    try {        
        await connection
        console.log("Connected to DB")

    } catch (error) {
        console.log(error)
        
    }
    console.log("Server is running on port number",process.env.PORT)
})