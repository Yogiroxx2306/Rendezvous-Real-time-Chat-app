const jwt = require('jsonwebtoken');
const { refresh } = require('../controllers/auth-controller');
const accessTokensecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokensecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const refreshModel = require('../models/refresh-model');
class TokenService{
    GenerateToken(payload){
        const accessToken = jwt.sign(payload,accessTokensecret,{
            expiresIn: '1m',
        });
        const refreshToken  = jwt.sign(payload,refreshTokensecret,{
            expiresIn: '1y',
        });
        return {accessToken,refreshToken};

    }
    async storeRefreshToken(token,userId){
        try{
            await refreshModel.create({
                token,
                userId,
            })
        }catch(err){
            console.log(err.message);
        }
    }
    async verifyAccessToken(token){
        return jwt.verify(token,accessTokensecret);
    }
    async verifyRefreshToken(refreshToken){
        return jwt.verify(refreshToken,refreshTokensecret);
    }
    async findRefreshToken(userId,refreshToken){
        const token = await refreshModel.findOne({
            userId: userId,
            token: refreshToken,
        });
        return token;
    }
    async updateRefreshToken(userId,refreshToken){
        return await refreshModel.updateOne(
            {userId : userId},
            {token: refreshToken},
        );
    }
    async removeToken(refreshToken){
       return await refreshModel.deleteOne({token: refreshToken}); 
    }
}
module.exports = new TokenService();