const mongoose = require("mongoose")
const path=require("path")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const connectMongodb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected succssfully")
       
    }
    catch (err) {
        console.error("Error while connecting to database")
        console.log(err.message)
        throw err;
        
    }
};
module.exports=connectMongodb