const jwt=require("jsonwebtoken");
const path=require("path")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
function GenerateToken(req,res){
    try{
        const {Email,result,user}=req.body;
    const value={
        Email
    }
    const token=jwt.sign(value,process.env.JWTPassword,{expiresIn:'1h'})
    res.status(201).json({
        success:true,
        message:"User added successfully and token is sent",
        token:token,
        user
    })
    }
    catch(error){
        console.log(error.message)
        res.status(404).json({ message: "error while adding user in token" })
    }
}

function verifyToken(req,res,next){
  try{
        const token=req.headers.authorization?.split(' ')[1]; //The ?. operator is used to safely access deeply nested properties without causing an error if one of the properties in the chain is null or undefined
        if (!token) {
            return res.status(401).json({ message: 'Access Denied. No token provided.' });
          }
        jwt.verify(token,process.env.JWTPassword,function (err,decoded){
            if(err){
                console.log("error while verifying user");
                res.status(401).json({message:"Session expired. Please Login again"});
                return;
            }
            if(decoded){
                console.log("user token is verified");
                req.user=decoded;  //attaaching user data to req object
                next();
            }
            else{
                console.log("User token is not valid");
                res.status(401).json({message:"User token is not valid"})
            }
        })

  }catch(error){
    console.log("error while verifying token",error.message);
    res.status(401).json({
        message:"token verification failed"
    })
  }
}
module.exports={
    GenerateToken,verifyToken
}