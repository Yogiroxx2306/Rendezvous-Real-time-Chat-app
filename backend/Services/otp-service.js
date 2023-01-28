const crypto = require('crypto');
const HashService = require('../Services/Hash-service');

const smssid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require('twilio')(smssid,smsAuthToken,{
    lazyLoading : true
});
class OtpService{
    async generateOtp(){
        const otp = crypto.randomInt(1000,9999);
        return otp;
    }

    async SendBySms(phone,otp){
        return await twilio.messages.create({
            to: phone,
            from: process.env.SMS_FROM_NUMBER,
            body: `Your Rendezvous OTP is ${otp}`
        });
    }
    verifyOtp(hashedOtp,data){
        let computedHash = HashService.hashOtp(data);
        return computedHash === hashedOtp;
    }
}
module.exports = new OtpService();