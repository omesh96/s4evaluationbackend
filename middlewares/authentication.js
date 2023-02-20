const jwt=require("jsonwebtoken")
require("dotenv").config()

const authentication=(req,res,next)=>{
    const token=req.headers.authorization
    if(token){
        const decode=jwt.verify(token,process.env.SECRET_KEY)
        if(decode){
            console.log(decode)
            req.body.user=decode.userId 
            next()
        } else{
            res.status(501).send({msg:"Please Login First"})
        }
    }
}
module.exports={authentication}