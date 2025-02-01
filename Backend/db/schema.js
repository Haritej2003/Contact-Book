const mongoose = require("mongoose")
const { isEmail,isAlpha, isNumeric }=require('validator')

const UserSchema=new mongoose.Schema({
    Name:{type:String,required:true,
        validate:{
            validator:function(Name){
                return isAlpha(Name)
            }
        }
    },
    Email:{type:String,required:true,
        validate:{
            validator:function(Email){
                return isEmail(Email)
            },
            message:props=>`${props.value} is not a valid email! `
        }
    },
    Password:{type:String,required:true}
   
})
//  added Validation constraints
const ContactSchema=new mongoose.Schema({
    Name:{type:String,required:true,
        validate:{
            validator:function(Name){
                return isAlpha(Name)
            }
        }
    },
    PhnNumber:{type:String,required:true,
        validate:{
            validator:function(PhnNumber){                
                return (PhnNumber.length==10 && isNumeric(PhnNumber) && PhnNumber[0]!="0")
            },
            message:props=>`${props.value} is not a valid Phone number! `
        }
    },
    Description:{type:String,default:"None"},
    UserId:{type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
        
    }

})
const Users=mongoose.model('Users',UserSchema)
const Contacts=mongoose.model('Contacts',ContactSchema)



module.exports= {
    Users,Contacts
};
