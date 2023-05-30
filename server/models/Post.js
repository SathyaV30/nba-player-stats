const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {type: String,required: true,},
  summary: {type: String,required: true,},
  content: {type: String,required: true,},
  author: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true,},
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true, }],
  created: { type: Date, default: Date.now },
}, {
  timestamps: true,  
});

const Post = mongoose.model('Post', PostSchema);
PostSchema.virtual('absoluteDiffLikesDislikes').get(function() {
  return Math.abs(this.likes.length - this.dislikes.length);
});

module.exports = Post;
