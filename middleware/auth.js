const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req,res,next)=>{
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token){
        return res.status(403).json({
            "message": "A token is required for authentication"
        });
    };
    try{
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    }catch(error){
        return res.status(401).json({
            "message": "Invalid Token"
        });
    };
    return next();
};
const checkRole = (permissions)=>{
    return (req,res,next)=>{
        if(permissions.includes(req.user.role)){
            next();
        }else{
            return res.status(401).json({
                "message": "You don\'t have permission!"
            });
        };
    };
};

module.exports = {verifyToken,checkRole};