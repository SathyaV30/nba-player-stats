const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  favoritePlayers: { type: [], default: [], required: false },
  bio: { type: String, required: false },
  favoriteTeam: { type: String, required: false, default: 'Not selected' },
  TriviaQuestionsAnswered: { type: Number, required: false, default: 0 },
  TriviaQuestionsCorrect: { type: Number, required: false, default: 0 },
  coins: { type: Number, required: true, default: 0 },
  location: { type: String, required: false, default: 'Not selected' },
  profilePic: { type: String, required: false, default: 'fallback.png' },
  pendingBets: {
    type: [
      {
        game: {
          home_team: { type: String, required: true },
          visitor_team: { type: String, required: true },
          selected_team: { type: String, required: true },
        },
      },
    ],
    parlayOdds: { type: Number, required: true },
    amount: { type: Number, required: true },
    default: [],
    required: false,
  },
  completedBets: {
    type: [
      {
        game: {
          home_team: { type: String, required: true },
          visiting_team: { type: String, required: true },
          selected_team:{ type: String, required: true },
        },
        parlayOdds: { type: Number, required: true },
        amount: { type: Number, required: true },
        result: { type: String, enum: ['win', 'lose'], required: true },
      },
    ],
    default: [],
    required: false,
  },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
