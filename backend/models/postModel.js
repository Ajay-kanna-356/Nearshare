const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    emailId: { type: String, required: true },
    username: { type: String, required: true },
    category: { type: String, required: true },
    condition: {type: String, required: true, enum: ['new', 'used', 'refurbished']},
    imgpath: { type: String, required: true }
  },
);

module.exports = mongoose.model('Post', postSchema);