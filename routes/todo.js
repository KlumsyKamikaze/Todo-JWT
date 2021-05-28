const router = require('express').Router();
const verifyToken = require('./verifyToken');
const User = require("../model/User");
const jwt = require("jsonwebtoken");

router.post('/save',verifyToken,async (req,res) => {
    console.log("save request recieved")
    const token = req.cookies.authToken;
    const payload = jwt.decode(token)._id
    console.log(payload)
    // const user = await User.findOne(payload);
    // if(!user) return res.status(400).send(`Something seems wrong with accesing arrTodo ${arrTodo}`);
    // console.log(arrTodo);

    const datasaved = await User.findByIdAndUpdate(payload,{arrTodo:req.body})
    console.log(datasaved)
    if(!datasaved) res.status(400).send("trouble saving data")
    res.status(200).send("Data saved");
})

router.get('/retrieve',verifyToken ,async (req,res) =>{
    const token = req.cookies.authToken;
    const payload = jwt.decode(token)._id
    console.log(payload)
    const user = await User.findById(payload);
    console.log(user)
    if(!user) return res.status(400).send("Something seems wrong with accesing arrTodo");

    res.status(200).send(user);
})

module.exports = router;