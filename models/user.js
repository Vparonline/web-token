const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  unique_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: String,
  username: String,
  password: String,
  user_img: { type: String, default: "uploads/userImage.jpg" },
  tokenLimit: { type: Number, default: 3 },
  botTokens: [{
    uniqueTokenId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    botToken: { type: String, required: true },
    serverId: { type: String, required: true },
    channelId: { type: String, required: true },
	  statusText: { type: String, default: "elchavopy web system"},
	  activitiesText: { type: String, default: "dnd"}
  }]
});

const User = mongoose.model('elchavopy-web-user-schema', userSchema);

module.exports = User;
