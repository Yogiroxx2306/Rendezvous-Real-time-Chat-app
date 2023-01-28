const otpService = require('../Services/otp-service');
const Hashservice = require('../Services/Hash-service');
const UserService = require('../Services/user-service');
const TokenService = require('../Services/Token-service');
const UserDto = require('../dtos/user-dto');
const userService = require('../Services/user-service');
class Authcontroller{
    async sendOtp(req,res){
        const {phone} = req.body;
        if(!phone)
        {
            return res.status(400).json({message:'Phone field is required!'});
            // return;
        }
        const otp = await otpService.generateOtp();
        const ttl = 1000*60*20;
        const expires = Date.now()+ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = Hashservice.hashOtp(data);
        try{
            // await otpService.SendBySms(phone,otp);
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp,
            })
        }catch(err)
        {
            console.log(err);
            return res.status(500).json({message:'message sending failed'});
        }
        // return res.json({"hash":hash});
    }
    async verifyOtp(req,res){
        const {otp,hash,phone} = req.body;
        if(!otp || !hash || !phone)
        {
            return res.status(400).json({message:"All fields are required"});
        }
        const [hashedOtp,expires]=hash.split('.');
        if(Date.now() > +expires)
        {
            return res.status(400).json({message:"OTP expired!"});
        }
        const data = `${phone}.${otp}.${expires}`;
        const isValid = otpService.verifyOtp(hashedOtp,data);
        if(!isValid)
        {
            return res.status(400).json({message:"Invalid OTP!"});
        }
        let user;
        try{
            user = await UserService.findUser({phone:phone});
            if(!user)
            {
                user = await UserService.CreateUser({phone:phone})
            }
        }catch(err){
            console.log(err);
            return res.status(500).json({message:"DB error"});
        }
        // Tokens
        const {accessToken,refreshToken} = TokenService.GenerateToken({_id: user._id,activated:false});

        await TokenService.storeRefreshToken(refreshToken,user._id);

        res.cookie('refreshToken',refreshToken,{    
            maxAge : 1000*60*60*24*30,
            httpOnly: true,
        });

        res.cookie('accessToken',accessToken,{    
            maxAge : 1000*60*60*24*30,
            httpOnly: true,
        });
        const userDto = new UserDto(user);
        res.json({auth:true,user:userDto});
    }
    async refresh(req,res){
        // get refresh tokens from cookie
        const {refreshToken : refreshTokenFromCookie} = req.cookies;
        // check if tokes in valid
        let UserData;
        try{
            UserData = await TokenService.verifyRefreshToken(refreshTokenFromCookie);
        }catch(err){
            return res.status(401).json({message:"Invalid Token!"});
        }
        // check if token is in db
        try{
            const token = await TokenService.findRefreshToken(UserData._id,refreshTokenFromCookie); 
            if(!token){
            return res.status(401).json({message:"Invalid Token!"});
            }
        }catch(err){
            return res.status(500).json({message:"Internal Error!"});
        }
        // check if valid user
        const user= await userService.findUser({_id:UserData._id});
        if(!user)
        {
            return res.status(404).json({message: "No User!"});
        }
        // generate new tokens
        const {refreshToken,accessToken} = TokenService.GenerateToken({
            _id : UserData._id,
        });
        // update refresh tokens
        try{
            await TokenService.updateRefreshToken(UserData._id,refreshToken);
        }catch(err){
            return res.status(500).json({message:"Internal Error!"});
        }
        // put in cookie
        res.cookie('refreshToken',refreshToken,{    
            maxAge : 1000*60*60*24*30,
            httpOnly: true,
        });

        res.cookie('accessToken',accessToken,{    
            maxAge : 1000*60*60*24*30,
            httpOnly: true,
        });
        // response
        const userDto = new UserDto(user);
        res.json({auth:true,user:userDto});
    }
    async logout(req,res){
        const {refreshToken} = req.cookies;
        // delete refresh token from db
        await TokenService.removeToken(refreshToken);
        // delete cookies
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({user:null ,auth: false});
    }
}
module.exports = new Authcontroller();