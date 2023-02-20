
const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { UserModel } = require("../models/Usermodel")

require("dotenv").config()

const UserRoute=express.Router()


// Register User //
UserRoute.post("/register",async(req,res)=>{
    try{
  const {name,email,password,gender,age,city}=req.body

  const existuseremail=new Promise((resolve,reject)=>{
    UserModel.findOne({email},(err,email)=>{
        if(err) return reject(new Error(err))
        if(email) return reject({msg:"User of this email is already exist"})
        resolve()
    })
  })

  Promise.all([existuseremail])
  .then(()=>{
    if(password){
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                return res.status(501).send({err})
            } else{
                const user=new UserModel({name,email,password:hash,gender,city,age})
                await user.save()
                res.status(200).send({msg:"User Register Successfully...!"})
            }
        })
    }
  })
  .catch((err)=>{
    res.status(500).send({msg:"User of this email is already exist"})
  })
    
    }
    catch(err){
        return res.status(500).send({err})
    }
})

// Login User // 

UserRoute.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
 UserModel.findOne({email},(err,user)=>{
    if(!user) res.status(404).send({err:"email not found..!"})
    if(user){
        console.log("user",user)
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                const token=jwt.sign({userId:user._id},process.env.SECRET_KEY)
                return res.status(200).send({msg:"Login Successfull...1",token:token})
            }
        })
    }
 })
    }
    catch(err){
        return res.status(501).send({err})
    }
})

module.exports={UserRoute}