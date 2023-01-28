const crypto = require('crypto');
class Hashservice{
    hashOtp(data){
        return crypto.createHmac('sha256',process.env.HASH_SECRET).update(data).digest('hex');
    }
}
module.exports = new Hashservice();