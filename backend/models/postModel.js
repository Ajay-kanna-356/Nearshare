const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    emailId: { type: String, required: true },
    username: { type: String, required: true },
    category: { type: String, required: true },
    condition: {type: String, required: true, enum: ['new', 'used', 'refurbished']},
    imgpath: { type: String, required: true },
    status: {type:String, default:"active", enum:["active","sold"]},
    lat: {type: Number, required: true},
    lon: {type: Number, required: true},
    address:{type:String,required:true},
    expiresAt: {type: Date,required: true} },
);

module.exports = mongoose.model('Post', postSchema);