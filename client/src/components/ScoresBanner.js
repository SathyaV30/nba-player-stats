import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import { AuthContext } from '../Auth';
import Coin from "./Coin";
import { CSSTransition } from 'react-transition-group';
import {FaTimes } from 'react-icons/fa';
import './Betslip.css'
import Draggable from 'react-draggable'; 

const ScoresBanner = () => {
  const [liveGames, setLiveGames] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isAuthenticated, user } = useContext(AuthContext);
  const [userCoins, setUserCoins] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState({});
  const [isBetslipOpen, setIsBetslipOpen] = useState(false);

const handleBetslipClick = () => {
  setIsBetslipOpen(!isBetslipOpen);
};



  const isCurrentDate = (date) => {
    const currentDate = new Date();
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };



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

  const getUserCoins = async () => {
    const res = await fetch('http://localhost:4000/Userdata', {
      headers: { 'Content-Type': 'application/json' },
      credentials:'include',
    });
    const data = await res.json();

    setUserCoins(data.coins);
  };

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
    getUserCoins();
  }, [selectedDate]);

  const getTimeStatus = (game) => {
    if (game.status === "Final") {
      return "Final";
    } else if (game.period === 0) {
      console.log(game.status)
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

  const handleSelectTeam = (gameId, team, game) => {
    setSelectedTeams((prevSelectedTeams) => {
      if (prevSelectedTeams[gameId] && prevSelectedTeams[gameId].selected_team === team) {
        const newSelectedTeams = { ...prevSelectedTeams };
        delete newSelectedTeams[gameId];
        localStorage.setItem('selectedTeams', JSON.stringify(newSelectedTeams));
        return newSelectedTeams;
      }
  
      const newSelectedTeams = {
        ...prevSelectedTeams,
        [gameId]: {
          selected_team: team.full_name,
          home_team: game.home_team.full_name,
          visitor_team: game.visitor_team.full_name,
          date: setFormattedDateString(new Date(game.date)),
        },
      };
      localStorage.setItem('selectedTeams', JSON.stringify(newSelectedTeams));
      return newSelectedTeams;
    });
  };
  
  useEffect(() => {
    const selectedTeamsFromLocalStorage = JSON.parse(localStorage.getItem('selectedTeams'));
    if (selectedTeamsFromLocalStorage) {
      setSelectedTeams(selectedTeamsFromLocalStorage);
    } else {
      setSelectedTeams({});
    }
    fetchLiveGames();
    getUserCoins();
  }, []);


  const Betslip = ({ isModalOpen, handleBetslipClick }) => {
  const positionFromLocalStorage = JSON.parse(localStorage.getItem('betslipPosition'));
  const [position, setPosition] = useState(positionFromLocalStorage || {x: 937, y: 93});

  const handleDrag = (e, ui) => {
    const {x, y} = position;
    setPosition({
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    });
  };
  
  const handleStop = (e, ui) => {
    const {x, y} = position;
    const newPosition = {
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    };
    localStorage.setItem('betslipPosition', JSON.stringify(newPosition));
    setPosition(newPosition);
  };

  
    const handleRemoveBet = (gameId) => {
      setSelectedTeams((prevSelectedTeams) => {
        const newSelectedTeams = { ...prevSelectedTeams };
        delete newSelectedTeams[gameId];
        localStorage.setItem('selectedTeams', JSON.stringify(newSelectedTeams));
        return newSelectedTeams;
      });
    };
    const [totalStake, setTotalStake] = useState('');
    const potentialWin = 2 * parseFloat(totalStake) || '';
    const handleTotalStakeChange = (event) => {
      const inputValue = event.target.value;
      if (isNaN(inputValue)) {
        toast.error('Please enter a number', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return; 
      }
      setTotalStake(inputValue);
    };
    
  
    const betslipContainerStyles = {
      position: 'absolute',
      width: '23%',
      zIndex: 1000
    };
  
    const betslipToggleStyles = {
      backgroundColor: '#17408b',
      color: '#fff',
      padding: '10px',
      cursor: 'pointer',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', 
    };
  
  
    const betslipDropdownStyles = {
      backgroundColor: '#f5f5f5',
      color: 'black',
      padding: '10px',
      marginTop: '10px',
      maxHeight: '400px',
      overflowY: 'scroll',
    };
  
    const betslipToggleTextStyles = {
      marginRight: '2px',
    };
  
    const betslipToggleArrowStyles = {
      fontSize: '80%',
    };
  
    return (
      <Draggable
      position={position}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div style={betslipContainerStyles}>
        <div style={betslipToggleStyles} onClick={handleBetslipClick}>
          <span style={betslipToggleTextStyles}>View Betslip</span>
          <span style={betslipToggleArrowStyles}>{isModalOpen ? '▲' : '▼'}</span>
        </div>
  
        <CSSTransition in={isModalOpen} timeout={300} classNames="slide" unmountOnExit>
        <div style={betslipDropdownStyles}>
  {Object.entries(selectedTeams).length === 0 ? (
    <span>No bets selected</span>
  ) : (
    <>
     
     <div style={{ display: 'flex', placeItems: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: '3%' }}>
  <Coin size="25px" />
  <span className="coin-text" style={{ marginLeft: '5px' }}>Balance: {userCoins} NBA Coins</span>
</div>

      {Object.entries(selectedTeams).map(([gameId, team]) => (
        team && (
          <div 
            key={gameId} 
            style={{
              marginBottom: '10px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              position: 'relative' 
            }}
          >
            <span style={{fontWeight: 'bold'}}>{team.selected_team}</span>
            <span style={{fontSize: '70%', color: '#A0A0A0'}}>Moneyline</span>
            <span style={{fontSize: '70%', color: '#A0A0A0'}}>{team.home_team} vs {team.visitor_team}</span>
            <span style={{fontSize: '70%', color: '#A0A0A0'}}>{team.date}</span>
            <button 
              onClick={() => handleRemoveBet(gameId)}
              style={{
                cursor: 'pointer', 
                backgroundColor: 'transparent', 
                color: '#17408b', 
                borderRadius: '25%', 
                border: 'none', 
                height: '25px', 
                width: '25px',
                position: 'absolute',
                top: '0', 
                right: '0',
                textAlign: 'center',
                padding: '0',
              }}
            >
              <FaTimes/>
            </button>
          </div>
        )
      ))}
      <div style = {{display:'flex', flexDirection:'column'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3%' }}>
  {Object.keys(selectedTeams).length >= 2 ? (
    <span>{Object.keys(selectedTeams).length} Leg Parlay</span>
  ) : (
    <span style ={{fontSize:'15px'}}>Single Game Bet</span>
  )}
  <span style ={{fontSize:'15px'}}>+110</span>
</div>
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3%' }}>
  <div style={{ marginRight: '10px', position: 'relative' }}>
    <label style={{ fontSize: '15px' }} htmlFor="totalStake">Total Stake</label>
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        id="totalStake"
        placeholder="Enter Amount"
        value={totalStake}
        onChange={handleTotalStakeChange}
        style={{
          padding: '5px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          width: '150px',
          paddingLeft: '30px',
        }}
      />
      <div style={{ position: 'absolute', top: '6px', left: '7px' }}>
        <Coin size="16px" />
      </div>
    </div>
  </div>
  <div style={{ position: 'relative' }}>
    <label style={{ fontSize: '15px' }}>Potential Win</label>
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={potentialWin}
        disabled
        style={{
          padding: '5px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          width: '150px',
          backgroundColor: '#f5f5f5',
          paddingLeft: '30px',
        }}
      />
      <div style={{ position: 'absolute', top: '6px', left: '7px' }}>
        <Coin size="16px" />
      </div>
    </div>
  </div>
</div>



      <button style ={{backgroundColor:'#17408b', border:'none', color:'white', padding:'3%', borderRadius:'5px', cursor:'pointer'}}>Submit</button>
      </div>
    </>
  )}
</div>

        </CSSTransition>
      </div> 
     
      </Draggable>
  
    );
  };
  
  return (
    <div className="scores-banner">
    <Betslip isModalOpen={isBetslipOpen} handleBetslipClick={handleBetslipClick}/>
      <h2>Live Scores</h2>
      <div className="date-navigation">
        <button onClick={handlePreviousDay} className="day-btn">
          Previous Day
        </button>
        <span className="date">{DateString}</span>
        <button onClick={handleNextDay} className="day-btn">
          Next Day
        </button>
      </div>
      {liveGames.length > 0 ? (
        <div className="games-container">
          {liveGames.map((game) => (
            <div key={game.id} className="game-card">
              <div className="team">
                <img
                  src={require(`../images/${game.visitor_team.full_name.replace(/\s/g, "_")}.png`)}
                  className="team-logo"
                  alt={`${game.visitor_team.full_name} Logo`}
                />
                <span className="team-name">{game.visitor_team.full_name}</span>
                <span className="score">{game.period > 0 && game.visitor_team_score}</span>
                {game.period === 0 && (
                  <button
                    className={`day-btn-2 ${selectedTeams[game.id]?.selected_team === game.visitor_team.full_name ? 'selected' : ''}`}
                    onClick={() => handleSelectTeam(game.id, game.visitor_team, game)}
                  >
                    -110
                  </button>
                )}

              </div>
              <div className="team">
                <img
                  src={require(`../images/${game.home_team.full_name.replace(/\s/g, "_")}.png`)}
                  className="team-logo"
                  alt={`${game.home_team.full_name} Logo`}
                />
                <span className="team-name">{game.home_team.full_name}</span>
                <span className="score">{game.period > 0 && game.home_team_score}</span>
                {game.period === 0 && (
                  <button
                    className={`day-btn-2 ${selectedTeams[game.id]?.selected_team === game.home_team.full_name ? 'selected' : ''}`}
                    onClick={() => handleSelectTeam(game.id, game.home_team, game)}
                  >
                    -110
                  </button>
                )}

              </div>
              <div className="time-status">{getTimeStatus(game)}</div>
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
