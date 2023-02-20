const express=require("express")
const cors=require("cors")
const { application } = require("express")
const { Connection } = require("./configuration/db")
const { UserRoute } = require("./routes/User")
const { authentication } = require("./middlewares/authentication.js")
const { PostRoute } = require("./routes/Post")

require("dotenv").config()
const app=express()

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Welcome To Evaluation-4")
})

// userRoute //
app.use("/users",UserRoute)

// post route with authentication middleware //
app.use(authentication)
app.use("/posts",PostRoute)

app.listen(process.env.PORT,async()=>{
    try{
    await Connection
    console.log("Connected To Database")
    }
    catch(err){
        console.log(err)
    }
    console.log(`Server is Running at http://localhost:${process.env.PORT}`)
})