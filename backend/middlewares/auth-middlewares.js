const TokenService = require("../Services/Token-service");

module.exports = async function(req,res,next){
    try{
        const {accessToken}=req.cookies;
        if(!accessToken){
            throw new Error();
        }
        const userData = await TokenService.verifyAccessToken(accessToken);
        if(!userData){
            throw new Error();
        }
        req.user = userData;
        next();
    }catch(err){
        res.status(401).json({message: 'Invalid Token'});
    }
}