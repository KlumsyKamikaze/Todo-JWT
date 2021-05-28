const jwt = require('jsonwebtoken');


module.exports = function auth(req,res,next){
    const token = req.cookies.authToken;
    if(!token) return res.status(401).send("access forbidden")

    console.log("authToken from cookies found");

    try{
        const verified = jwt.verify(token,"jfndcnjgslcnkmbfgbs");
        req.user = verified
        console.log("authToken from cookies verified");
    }catch(err){
        res.status(400).send('Wrong token',err);
    }
    next();
}