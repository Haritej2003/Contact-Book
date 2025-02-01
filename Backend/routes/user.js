const express = require("express")
const mongoose =require("mongoose")
const path=require("path")
const router = express.Router()
const { Users, Contacts } = require("../db/schema")
const { z } = require('zod')
const bcrypt = require('bcrypt')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { GenerateToken, verifyToken } = require("./middlewares.js")
const UserBackendSchema = z.object({
    Name: z.string({ required_error: "Name is required" }),
    Email: z.string({ required_error: "Email is required" }).email({ required_error: "Email is invalid" }),
    Password: z.string({ required_error: "Password is required" })
})
const UserEmailSchema = z.string({ required_error: "Email is required" }).email({ required_error: "Email is invalid" })
// for signup
// generated a JWT token and sent it in response to user and store in localstorage
router.post("/sign-up", async (req, res, next) => {
    try {
        const validation = UserBackendSchema.safeParse(req.body);
        if (!validation.success) {
            const errors = validation.error.errors.map((err) => err.message);
            return res.status(400).json({ success: false, errors });
        }
        console.log("validation success")
        const { Name, Email, Password } = req.body
        const isUserExist = await Users.findOne({ Email })
        if (isUserExist) {
            console.log("user already exists")
            res.status(401).json({ message: "Looks like you have already registered. Please Login" })
            return;
        }
        const saltRounds = process.env.SaltRounds;
        const salt = await bcrypt.genSalt(parseInt(saltRounds,10))
        const hashedpassword =await  bcrypt.hash(Password, salt);
        console.log("hashed password created")
        const user = new Users({
            Name, Email, Password: hashedpassword
        })
        const result = await user.save();
        console.log("user added")
        req.body = { ...req.body, "user": result._id }

        // res.status(201).json({ success: true, message: "User added successfully", user: result });
        next()
    }
    catch (error) {
        console.log(error.message)
        res.status(400).json({ message: "error while adding user" ,errorMessage:console.error()
        })
    }


}, GenerateToken);


//for login
///getUser/abc@gmail.com ---------> req.params ---req.params.id
///getUser?Email=abc@gmail.com ---------> req.query ---req.query.id
// password verification
router.post("/login", async (req, res, next) => {
    try {
        const { Email, Password } = req.body;
        const validation = UserEmailSchema.safeParse(Email);
        console.log("email ...")
        if (!validation.success) {
            const errors = validation.error.errors.map((err) => err.message);
            return res.status(400).json({ success: false, message: "Failed" });
        }
        console.log("email verified")
        const user = await Users.findOne({ Email })
        if (!user) {
            console.log("user does not exist")
            res.status(404).json({ message: "user does not exists" })
            return;
        }
        const HashedPassword = user.Password;
        
        // password verification
        bcrypt.compare(Password, HashedPassword, (err, result) => {
            if (err) {
                console.log("error while verifying user ", err.message);
                res.status(403).json({ message: "error while verifying user" })
                return;
            }
            if (result) {
                console.log("User verified and logged in")
                req.body = { ...req.body, "result": result,"user":user._id } 
                next();
            } else {
                console.log("Password mismatch");
                res.status(403).json({ message: "Invalid password" });
            }
        })
    } catch (error) {
        console.error(error.message)
        res.status(400).json({ message: error.message })

    }



}, GenerateToken)
// add authentication middleware to verify the user before editing details
// router.put("/editUser",(req,res)=>{

// })

router.post("/current-user",verifyToken,async (req,res)=>{
    const {Email}=req.user;
    const user = await Users.findOne({ Email })
        if (!user) {
            console.log("user does not exist")
            res.status(404).json({ message: "user does not exists" })
            return;
        }
        
    const contacts=await Contacts.find({UserId:new mongoose.Types.ObjectId(user._id) });
    
    return res.status(200).json({
        message:"user returned successfully",
        user:{
            Name:user.Name,
            Email:user.Email
        },
        contacts
            
        
    })
})
module.exports = router
