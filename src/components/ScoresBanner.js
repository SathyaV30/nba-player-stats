import React, { useState, useEffect } from "react";
import axios from "axios";

const ScoresBanner = () => {
  const [liveGames, setLiveGames] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchLiveGames = async () => {
    const selectedDateString = selectedDate.toISOString().split("T")[0];

    try {
      const response = await axios.get(
        `https://www.balldontlie.io/api/v1/games?dates[]=${selectedDateString}`
      );
      setLiveGames(response.data.data);
    } catch (error) {
      console.error("Error fetching live games:", error);
    }
  };

  useEffect(() => {
    fetchLiveGames();

    const interval = setInterval(fetchLiveGames, 10000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  const getTimeStatus = (game) => {
    if (game.status === "Final") {
      return "Final";
    } else if (game.period === 0) {
      return "Scheduled";
    } else {
      return `${game.time}`;
    }
  };

  const handlePreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
  };

  return (
    <div className="scores-banner">
      <h2>Live Scores</h2>
      <div className="date-navigation">
        <button onClick={handlePreviousDay} className="day-btn">Previous Day</button>
        <span>{selectedDate.toDateString()}</span>
        <button onClick={handleNextDay} className="day-btn">Next Day</button>
      </div>
      {liveGames.length > 0 ? (
        <div className="games-container">
          {liveGames.map((game) => (
            <div key={game.id} className="game-card">
              <div className="team">
                <img
                  src={require(`../images/${game.visitor_team.full_name.replace(
                    /\s/g,
                    "_"
                  )}.png`)}
                  className="team-logo"
                  alt={`${game.visitor_team.full_name} Logo`}
                />
                <span className="team-name">{game.visitor_team.full_name}</span>
                <span className="score">{game.visitor_team_score}</span>
              </div>
              <div className="team">
                <img
                  src={require(`../images/${game.home_team.full_name.replace(
                    /\s/g,
                    "_"
                  )}.png`)}
                  className="team-logo"
                  alt={`${game.home_team.full_name} Logo`}
                />
                <span className="team-name">{game.home_team.full_name}</span>
                <span className="score">{game.home_team_score}</span>
              </div>
              <span className="time-status">{getTimeStatus(game)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-games">No games scheduled</p>
      )}
    </div>
  );
};

export default ScoresBanner;