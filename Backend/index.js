
const express = require("express")
const connectMongodb = require("./db/mongodb.js")
// const { connect } = require("mongoose")
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contact");
// environment variable
dotenv.config();
const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
connectMongodb()
app.use("/user",userRoutes);
app.use("/contact",contactRoutes);
app.listen(PORT, () => {
    console.log(`Connected to ${PORT} successfully`)
})
