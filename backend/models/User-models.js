const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const UserSchema = new Schema({
    phone: {type: String, required: true},
    name: {type: String, required: false},
    avatar: {type: String, required: false},
    activated: {type: Boolean,required: false,default:false}
},
{
    timestamps: true,
});
module.exports = mongoose.model('User',UserSchema,'users')