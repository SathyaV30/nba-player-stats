const mongoose = require('mongoose');

const MatchupSchema = new mongoose.Schema({
  homeTeam: {
    type: String,
    required: true
  },
  awayTeam: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  odds: {
    homeTeam: {
      type: Number,
      required: true,
      default: 1.0
    },
    awayTeam: {
      type: Number,
      required: true,
      default: 1.0
    }
  },
  betCounts: {
    homeTeam: {
      type: [String], 
      default: []
    },
    awayTeam: {
      type: [String], 
      default: []
    }
  }
});

const Matchup = mongoose.model('Matchup', MatchupSchema);

module.exports = Matchup;
