const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    emailId: { type: String, required: true },
    category: { type: String, required: true },
    imgpath: { type: String, required: true }
  },
);

module.exports = mongoose.model('Post', postSchema);