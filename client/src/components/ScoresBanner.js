import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ScoresBanner = () => {
  const [liveGames, setLiveGames] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  function convertToEST(dateString) {
    var date = new Date(dateString);
    var estOffset = 5;
    var edtOffset = 4;
    var offset;
    
    if ((date.getUTCMonth() > 2 && date.getUTCMonth() < 10) || 
        (date.getUTCMonth() === 2 && date.getUTCDate() >= 8 && date.getUTCDay() === 0) || 
        (date.getUTCMonth() === 10 && date.getUTCDate() <= 7 && date.getUTCDay() === 0)) {
        offset = edtOffset; 
    } else {
        offset = estOffset;
    }

    date.setUTCHours(date.getUTCHours() - offset);
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    return strTime;
}

  const setFormattedDateString = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const [DateString, setDateString] = useState(setFormattedDateString(selectedDate));

  const fetchLiveGames = async () => {
    const selectedDateString = selectedDate.toISOString().split("T")[0];

    try {
      const response = await axios.get(
        `https://www.balldontlie.io/api/v1/games?dates[]=${selectedDateString}`
      );
      setLiveGames(response.data.data);
    } catch (error) {
      console.error("Error fetching live games:", error);
      toast.error('Error fetching live games. Please try again in one minute', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    
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
      return convertToEST(game.status) + " EST";
    } else {
      return `${game.time}`;
    }
  };

  const handlePreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(previousDay);
    setDateString(setFormattedDateString(previousDay));
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
    setDateString(setFormattedDateString(nextDay));
  };


  return (
    <div className="scores-banner">
      <h2>Live Scores</h2>
      <div className="date-navigation">
        <button onClick={handlePreviousDay} className="day-btn">
          Previous Day
        </button>
        <span>{DateString}</span>
        <button onClick={handleNextDay} className="day-btn">
          Next Day
        </button>
      </div>
      {liveGames.length > 0 ? (
        <div className="games-container">
          {liveGames.map((game) => (
            <div key={game.id} className="game-card" style ={{minWidth:'580px', maxWidth:'580px', minHeight:'200px', maxHeight:'200px'}} >
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
                <span className="score">{game.period > 0 && game.visitor_team_score}</span>
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
                <span className="score">{game.period > 0 && game.home_team_score }</span>
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
