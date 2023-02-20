const express=require("express")

const jwt=require("jsonwebtoken")
const { Postmodel } = require("../models/Postmodel")

require("dotenv").config()

const PostRoute=express.Router()

// Get Post //
PostRoute.get("/",async(req,res)=>{
    try{
    const token=req.headers.authorization
    if(token){
        const decode=jwt.verify(token,process.env.SECRET_KEY)
        if(decode){
            const posts=await Postmodel.find({user:decode.userId})
           if(posts.length>0){
            res.status(201).send(posts)
           } else{
            res.status(500).send({err:"No Notes Availabe"})
           }
        } else{
            res.status(500).send({err:"Please Login First"})
        }
    } else{
        res.status(500).send({err:"No Notes Availabe"})
    }
    }
    catch(err){
        res.status(500).send({err:"No Notes Availabe"})
    }
})

 // Add Post //

 PostRoute.post("/addpost",async(req,res)=>{
    try{
        const payload=req.body
        const posts=new Postmodel(payload)
        await posts.save()
        res.status(201).send({msg:"Post Created Successfully...!"})
    }
    catch(err){
        res.status(500).send({msg:"Please lOGIN fIRST"})
    }
 })

 // Delete Note //
 PostRoute.delete("/delete/:id",async(req,res)=>{
     const id=req.params.id
     const user_id_making_req=req.body.user   // it is coming from middleware
     try{
const validate=await Postmodel.findById(id)
 if(validate){
    if(validate.user===user_id_making_req){
        await Postmodel.findByIdAndDelete(id)
        res.status(201).send({msg:"Post Deleted Successfully...!"})
    } else{
        res.status(500).send({msg:"You are not Authorised to delete this post"})
    }
 } else{
    res.status(500).send({msg:"Note Not Found!"})
 }
     }
     catch(err){
        res.status(501).send({err})
     }
 })

  // update Post //
  PostRoute.patch("/update/:id",async(req,res)=>{
    const id=req.params.id
    const user_id_making_req=req.body.user   // it is coming from middleware
    try{
        const payload=req.body
const validate=await Postmodel.findById(id)
if(validate){
   if(validate.user===user_id_making_req){
       await Postmodel.findByIdAndUpdate({_id:id},payload)
       res.status(201).send({msg:"Post Updated Successfully...!"})
   } else{
       res.status(500).send({msg:"You are not Authorised to Update this post"})
   }
} else{
   res.status(500).send({msg:"Note Not Found!"})
}
    }
    catch(err){
       res.status(501).send({err})
    }
})


module.exports={PostRoute}