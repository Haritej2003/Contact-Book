const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const { Contacts,Users } = require("../db/schema")
const {z}=require("zod")
const {verifyToken}=require("./middlewares");
const ObjectIdRegex = /^[a-fA-F0-9]{24}$/;
const ContactSchema=z.object({
        Name:z.string({ required_error: "Name is required" }),
        PhnNumber:z.string().length(10,{ message: "Must be a phone number" }),
        Description:z.string().optional(),
        UserId:z.string().regex(ObjectIdRegex, "Invalid ObjectId format")
})
router.post("/add",verifyToken,async (req,res)=>{
        try{
                const {Name,PhnNumber,Description,UserId}=req.body;
                const validation=ContactSchema.safeParse(req.body);
                if (!validation.success) {
                    const errors = validation.error.errors.map((err) => err.message);
                    return res.status(400).json({ success: false, errors, message:"invalid format of name or mobile number" });
                }
                console.log("validation success");
                const isUserExist = await Users.findById(UserId)
            if (!isUserExist) {
                console.log("user doesnot exists")
                res.status(401).json({ message: "user doesnot exist" })
                return;
            }
            
            console.log("user exist")           
            const isContactsExist = await Contacts.find({UserId })
            
            if(isContactsExist.length>0){
                console.log("checking")
                for(const contact of isContactsExist){
                    if(contact.PhnNumber===PhnNumber){
                        console.log("contact already exists")
                        return res.status(401).json({ message: "contact already exist" })
                        
                    }
                }
                
                console.log("checked")
            }
            //////
            console.log("No duplicate found")           
            const contact=new Contacts({
                Name,PhnNumber,Description,UserId
            })
            await contact.save();
            console.log("Contacts added")
            res.status(200).json({ message: "Contact successfully added" ,contact});





        }catch(error){
            console.log("error while adding contact",error.message)
                res.status(401).json({ message: "adding contact failed",errorMessage:error.message })
        }
})

/**
router.put("/edit",verifyToken,async (req,res)=>{
    try{
        const { _id } = req.query;
        const { Name, PhnNumber, Description,UserId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }
        if (!Name || !PhnNumber) {
            return res.status(400).json({ message: "All fields are required." });
        }
       
        
        const existingContact = await Contacts.findById(_id);
        if (!existingContact) {
            return res.status(404).json({ message: "Contact not found." });
        }
        
        const updatedContact = await Contacts.findByIdAndUpdate(
           _id,
            { Name, PhnNumber, Description, UserId }, // fields to update
            { new: true } // return the updated document
        );
        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found." });
        }
        res.status(200).json({ message: "Contact updated successfully", updatedContact });

    }catch(error){
        console.error(error);
        res.status(400).json({ message: "Server error" ,errorMessage:error.message});
    }

})

*/
router.delete("/deleteContact",verifyToken,async (req,res)=>{
    try{
        const {_id}=req.query;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }
        const existingContact = await Contacts.findByIdAndDelete(_id);
        if (!existingContact) {
            return res.status(404).json({ message: "Contact not found." });
        }
        res.status(200).json({ message: "Contact deleted successfully", existingContact });


    }catch(error){
        console.error(error);
        res.status(400).json({ message: "Server error" ,errorMessage:error.message});
    }
})
module.exports=router