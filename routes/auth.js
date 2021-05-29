const express = require("express");
const User = require("../model/User")
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



router.post("/register", async(req,res) => {
    // Check if the user already exists
    const emailExist = await User.findOne({email : req.body.email})
    if(emailExist) return res.status(400).send("User already exists")

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })
    try{
        const savedUser = await user.save();
        res.redirect('/login');
    }catch(err){
        res.status(400).send(err);
    }
})

router.post("/login", async (req,res) =>{
    console.log("login credentials received");
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("Email or password is wrong");

    console.log("User found")

    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send("Email or password is wrong");

    console.log("password is valid as well");

    const token = jwt.sign({_id: user._id},process.env.TOKEN)
    res.cookie('authToken',token).redirect('/todo')
    console.log('left from login for todo')
    
})

module.exports = router;