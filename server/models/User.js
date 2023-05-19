const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
  username: {type: String, required: true, min: 4, unique: true},
  password: {type: String, required: true},
  favoritePlayers: { type: [], default: [], required: false },
  bio: { type: String, required: false },
  favoriteTeam: { type: String, required: false, default:'Not selected' },
  TriviaQuestionsAnswered: {type: Number, required: false, default: 0},
  TriviaQuestionsCorrect:{type: Number, required: false, default: 0}
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
