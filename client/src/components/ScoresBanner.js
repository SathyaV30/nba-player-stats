import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import { AuthContext, ThemeContext } from '../Auth';
import Coin from "./Coin";
import { CSSTransition } from 'react-transition-group';
import { FaTimes, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import './Betslip.css'
import Draggable from 'react-draggable'; 
import { FaTrophy } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import { backendUrl } from '../config';
import LoadingAnimation from "./Loading";


const ScoresBanner = () => {
  const [liveGames, setLiveGames] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isAuthenticated, user } = useContext(AuthContext);
  const [userCoins, setUserCoins] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState({});
  const [isBetslipOpen, setIsBetslipOpen] = useState(false);
  const [userPredictions, setUserPredictions] = useState({});
  const [loading, setLoading] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
  const {theme} = useContext(ThemeContext);
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  
  const handleBetslipClick = () => {
    setIsBetslipOpen(!isBetslipOpen);
  };
  



  const liveGames1 = [
    {
      "id": 2,
      "date": "2023-06-23T20:00:00.000Z",
      "home_team_score": null,
      "visitor_team_score": null,
      "season": 2023,
      "period": 0,
      "status": "2023-06-23T20:00:00.000Z",
      "time": "8:00 PM",
      "postseason": false,
      "home_team": {
        "id": 1,
        "abbreviation": "ATL",
        "city": "Atlanta",
        "conference": "East",
        "division": "Southeast",
        "full_name": "Atlanta Hawks",
        "name": "Hawks"
      },
      "visitor_team": {
        "id": 4,
        "abbreviation": "BKN",
        "city": "Brooklyn",
        "conference": "East",
        "division": "Atlantic",
        "full_name": "Brooklyn Nets",
        "name": "Nets"
      }
    },
    {
      "id": 3,
      "date": "2023-06-23T20:30:00.000Z",
      "home_team_score": null,
      "visitor_team_score": null,
      "season": 2023,
      "period": 0,
      "status": "2023-06-23T20:30:00.000Z",
      "time": "8:30 PM",
      "postseason": false,
      "home_team": {
        "id": 3,
        "abbreviation": "BOS",
        "city": "Boston",
        "conference": "East",
        "division": "Atlantic",
        "full_name": "Boston Celtics",
        "name": "Celtics"
      },
      "visitor_team": {
        "id": 6,
        "abbreviation": "CHA",
        "city": "Charlotte",
        "conference": "East",
        "division": "Southeast",
        "full_name": "Charlotte Hornets",
        "name": "Hornets"
      }
    },
    {
      "id": 4,
      "date": "2023-06-23T22:00:00.000Z",
      "home_team_score": null,
      "visitor_team_score": null,
      "season": 2023,
      "period": 0,
      "status": "2023-06-23T22:00:00.000Z",
      "time": "10:00 PM",
      "postseason": false,
      "home_team": {
        "id": 14,
        "abbreviation": "MIA",
        "city": "Miami",
        "conference": "East",
        "division": "Southeast",
        "full_name": "Miami Heat",
        "name": "Heat"
      },
      "visitor_team": {
        "id": 28,
        "abbreviation": "SAS",
        "city": "San Antonio",
        "conference": "West",
        "division": "Southwest",
        "full_name": "San Antonio Spurs",
        "name": "Spurs"
      }
    },
    {
      "id": 5,
      "date": "2023-06-23T19:00:00.000Z",
      "home_team_score": null,
      "visitor_team_score": null,
      "season": 2023,
      "period": 0,
      "status": "2023-06-23T19:00:00.000Z",
      "time": "7:00 PM",
      "postseason": false,
      "home_team": {
        "id": 7,
        "abbreviation": "CHI",
        "city": "Chicago",
        "conference": "East",
        "division": "Central",
        "full_name": "Chicago Bulls",
        "name": "Bulls"
      },
      "visitor_team": {
        "id": 15,
        "abbreviation": "MIL",
        "city": "Milwaukee",
        "conference": "East",
        "division": "Central",
        "full_name": "Milwaukee Bucks",
        "name": "Bucks"
      }
    }
  ];

  const gameResults = [
    {
      "id": 2,
      "date": "2023-06-23T20:00:00.000Z",
      "home_team_score": 105,
      "visitor_team_score": 112,
      "season": 2023,
      "period": 4,
      "status": "Final",
      "time": " ",
      "postseason": false,
      "home_team": {
        "id": 1,
        "abbreviation": "ATL",
        "city": "Atlanta",
        "conference": "East",
        "division": "Southeast",
        "full_name": "Atlanta Hawks",
        "name": "Hawks"
      },
      "visitor_team": {
        "id": 4,
        "abbreviation": "BKN",
        "city": "Brooklyn",
        "conference": "East",
        "division": "Atlantic",
        "full_name": "Brooklyn Nets",
        "name": "Nets"
      }
    },
    {
      "id": 3,
      "date": "2023-06-23T20:30:00.000Z",
      "home_team_score": 110,
      "visitor_team_score": 104,
      "season": 2023,
      "period": 4,
      "status": "Final",
      "time": " ",
      "postseason": false,
      "home_team": {
        "id": 3,
        "abbreviation": "BOS",
        "city": "Boston",
        "conference": "East",
        "division": "Atlantic",
        "full_name": "Boston Celtics",
        "name": "Celtics"
      },
      "visitor_team": {
        "id": 6,
        "abbreviation": "CHA",
        "city": "Charlotte",
        "conference": "East",
        "division": "Southeast",
        "full_name": "Charlotte Hornets",
        "name": "Hornets"
      }
    },
    {
      "id": 4,
      "date": "2023-06-23T22:00:00.000Z",
      "home_team_score": 98,
      "visitor_team_score": 105,
      "season": 2023,
      "period": 4,
      "status": "Final",
      "time": " ",
      "postseason": false,
      "home_team": {
        "id": 14,
        "abbreviation": "MIA",
        "city": "Miami",
        "conference": "East",
        "division": "Southeast",
        "full_name": "Miami Heat",
        "name": "Heat"
      },
      "visitor_team": {
        "id": 28,
        "abbreviation": "SAS",
        "city": "San Antonio",
        "conference": "West",
        "division": "Southwest",
        "full_name": "San Antonio Spurs",
        "name": "Spurs"
      }
    },
    {
      "id": 5,
      "date": "2023-06-23T19:00:00.000Z",
      "home_team_score": 115,
      "visitor_team_score": 110,
      "season": 2023,
      "period": 4,
      "status": "Final",
      "time": " ",
      "postseason": false,
      "home_team": {
        "id": 7,
        "abbreviation": "CHI",
        "city": "Chicago",
        "conference": "East",
        "division": "Central",
        "full_name": "Chicago Bulls",
        "name": "Bulls"
      },
      "visitor_team": {
        "id": 15,
        "abbreviation": "MIL",
        "city": "Milwaukee",
        "conference": "East",
        "division": "Central",
        "full_name": "Milwaukee Bucks",
        "name": "Bucks"
      }
    }
  ];
    
  
  function convertUTCDateToLocalDate(utcDateString) {
    const utcDate = new Date(utcDateString);
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    return utcDate.toLocaleDateString(undefined, options);
  }
  
  useEffect(() => {
    const fetchUserPredictions = async () => {
      try {
        const userPredictionsMap = {};
  
        const fetchPromises = liveGames1.map(async (game) => {
          if (game.period!=0) {
            return
          }
          const { home_team, visitor_team, date } = game;
          const newDate = convertUTCDateToLocalDate(date);
          const response = await axios.get(`${backendUrl}/UsersPredictions?home_team=${encodeURIComponent(home_team.full_name)}&visitor_team=${encodeURIComponent(visitor_team.full_name)}&date=${encodeURIComponent(newDate)}`);
          const { homeTeamPercentage, awayTeamPercentage } = response.data;
          userPredictionsMap[game.id] = { homeTeamPercentage, awayTeamPercentage };
        });
  
      
        await Promise.all(fetchPromises);
        setUserPredictions(prevState => ({ ...prevState, ...userPredictionsMap }));

      } catch (error) {
        console.error('Error fetching user predictions:', error);
      }
    };
  
    fetchUserPredictions();
  }, []);
  





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

    if (
      (date.getUTCMonth() > 2 && date.getUTCMonth() < 10) ||
      (date.getUTCMonth() === 2 && date.getUTCDate() >= 8 && date.getUTCDay() === 0) ||
      (date.getUTCMonth() === 10 && date.getUTCDate() <= 7 && date.getUTCDay() === 0)
    ) {
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
    minutes = minutes < 10 ? '0' + minutes : minutes;
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
    const res = await fetch(`${backendUrl}/Userdata`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await res.json();

    setUserCoins(data.coins);
  };


  const fetchLiveGames = async () => {
    setLoading(true);
    const selectedDateString = selectedDate.toISOString().split("T")[0];

    try {
      const response = await axios.get(
        `https://www.balldontlie.io/api/v1/games?dates[]=${selectedDateString}`
      );
        setLiveGames(response.data.data);
       // setLiveGames(liveGames1) //NBA offseason test data
      }
     catch (error) {
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
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveGames();
    getUserCoins();
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

  const handleSelectDay = (event) => {
    if (event.target.value.trim() !== "") {
      const selectedDay = new Date(event.target.value);
      setSelectedDate(selectedDay);
      setDateString(setFormattedDateString(selectedDay));
    }
  };
  
  const handleSelectTeam = (gameId, team, game, e) => {
    if (!isAuthenticated) {
      toast.error('Please login or register to make predictions', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return
    }
    setSelectedTeams((prevSelectedTeams) => {
      if (
        prevSelectedTeams[gameId] &&
        prevSelectedTeams[gameId].selected_team === team
      ) {
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
    const [position, setPosition] = useState(positionFromLocalStorage || { x: 0, y: 0 });
    const [mult, setMult] = useState(1.00);
    const [totalStake, setTotalStake] = useState('');

    const handleDrag = (e, ui) => {
      const { x, y } = position;
      setPosition({
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      });
    };

    const handleStop = (e, ui) => {
      const { x, y } = position;
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

    const handleTotalStakeChange = (event) => {
      const inputValue = event.target.value;
      if (isNaN(inputValue)) {
        toast.error('Please enter a positive value', {
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

//TODO
    const handleParlaySubmit = async () => {
    
     
      try {

        const userId = user; 
        const formattedDate = setFormattedDateString(new Date());
        const response = await axios.get(`https://www.balldontlie.io/api/v1/games?dates[]=${formattedDate}`);
    
        const liveGames = response.data.data;
        let hasGameStarted = false;
    
        for (const [teamKey, team] of Object.entries(selectedTeams)) {
          const liveGame = liveGames.find((game) => game.id === team.gameId);
          if (liveGame && liveGame.period !== 0) {
            delete selectedTeams[teamKey];
            hasGameStarted = true;
          }
        }
    
        if (hasGameStarted) {
          toast.error('Cannot submit parlay. One or more selected games have already started and have been removed.', {
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
    
        
        const payload = {
          selectedTeams,
          username:user 
        };
    
      
        const postResponse = await axios.post(`${backendUrl}/SubmitParlay`, payload, {
          withCredentials: true
        });


        toast.success('Parlay successfully submitted!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
    
       
    
        setSelectedTeams({});
        localStorage.removeItem('selectedTeams');
        setTimeout(() => {
          window.location.reload();
        }, 3500); 





    
      } catch (error) {
        console.error("Error submitting parlay:", error);
        toast.error('Error submitting parlay. Please try again.', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000
        });
      }
    };
    
    
    
    const betslipContainerStyles = {
      position: 'absolute',
      width: windowDimensions.width <=768 ? '80%' : '30%',
      zIndex: 1000,
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 2.5px 15px 0px',
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
      backgroundColor: theme == 'light' ? '#f1f1f1' : '#353535',
      color: theme == 'light' ? '#353535' : '#e8e5e5',
      padding: '10px',
      marginTop: '10px',
      overflow: 'hidden',
      maxWidth: '100%',
    };

    const betslipToggleTextStyles = {
      marginRight: '2px',
    };

    const betslipToggleArrowStyles = {
      fontSize: '80%',
    };

    useEffect(() => {
      let totalMultiplier = 1;
      const calculateModifiedOdds = (communityPercentage) => {
          if (communityPercentage === 100) {
              return 1.1;
          }
          if (communityPercentage === 0) {
              return 10;
          }
          return 2 - Math.log2(communityPercentage / 50);
      };
  
   
      for (const [gameId, selection] of Object.entries(selectedTeams)) {
          const selectedTeamName = selection.selected_team;
  
          for (const game of liveGames1) {
              if (game.id.toString() === gameId) {
                  if (userPredictions && userPredictions[gameId]) {
                      const homeTeamPercentage = userPredictions[gameId].homeTeamPercentage;
                      const awayTeamPercentage = userPredictions[gameId].awayTeamPercentage;
                      const odds = game.home_team.full_name === selectedTeamName
                          ? calculateModifiedOdds(homeTeamPercentage)
                          : calculateModifiedOdds(awayTeamPercentage);
  
                      totalMultiplier *= odds;
                  } else {
                      totalMultiplier *= 2.00;
                  }
              }
          }
      }
  
      setMult(totalMultiplier);
  
  }, [selectedTeams]);
  

  

    const getOdds = (teamName, userPredictions) => {
      const calculateModifiedOdds = (communityPercentage) => {
        if (communityPercentage == 100) {
          return 1.1
        }
        if (communityPercentage == 0) {
          return 10
        }
          return 2 - Math.log2(communityPercentage / 50);
      };
    
      for (const game of liveGames1) {
          if (game.home_team.full_name === teamName || game.visitor_team.full_name === teamName) {
              const gameId = game.id;
              
             
              if (userPredictions && userPredictions[gameId]) {

                  const homeTeamPercentage = userPredictions[gameId].homeTeamPercentage;
                  const awayTeamPercentage = userPredictions[gameId].awayTeamPercentage;
                  const odds = game.home_team.full_name === teamName
                      ? calculateModifiedOdds(homeTeamPercentage)
                      : calculateModifiedOdds(awayTeamPercentage);
                
                  return <span>{odds.toFixed(2)}x</span>;
              } else {
                  return <span>2.00x</span>;
              }
          }
      }
  
      return null;
  };
  
  

    return (
      <Draggable
        position={position}
        onDrag={handleDrag}
        onStop={handleStop}
      >
        <div style={betslipContainerStyles}>
        <div 
    style={betslipToggleStyles} 
    onClick={(e) => {
        fetchLiveGames();
        handleBetslipClick();
    }}
    onTouchEnd={(e) => {
        e.preventDefault(); 
        fetchLiveGames();
        handleBetslipClick();
    }}
>
    <span style={betslipToggleTextStyles}>Predictions</span>
    <span style={betslipToggleArrowStyles}>{isModalOpen ? '▲' : '▼'}</span>
</div>

          <CSSTransition in={isModalOpen} timeout={300} classNames="slide" unmountOnExit>
            <div style={betslipDropdownStyles}>
              {Object.entries(selectedTeams).length === 0 ? (
                <span>No teams selected</span>
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
                    <span style={{ fontWeight: 'bold' }}>
                     {team.selected_team} ({getOdds(team.selected_team, userPredictions)})
                    </span>

                        <span style={{ fontSize: '70%', color: '#A0A0A0' }}>{team.home_team} vs {team.visitor_team}</span>
                        <span style={{ fontSize: '70%', color: '#A0A0A0' }}>{team.date}</span>
                        <button
                          onClick={() => handleRemoveBet(gameId)}
                          onTouchEnd = {() => handleRemoveBet(gameId)}
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
                          <FaTimes />
                        </button>
                      </div>
                    )
                  ))}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3%' }}>
                      {Object.keys(selectedTeams).length >= 2 ? (
                        <>
                        <span>{Object.keys(selectedTeams).length} Leg Parlay</span>
                        <span>{mult.toFixed(2)}x</span>
                        </>
                      ) : (
                        <span style={{ fontSize: '15px' }}>Single Game Bet</span>
                      )}
                     
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
                        onTouchStart={(event) => {
                            event.preventDefault(); 
                            event.target.focus(); 
                        }}
                        style={{
                          padding: '5px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          width: '130px',
                          paddingLeft: '25px',
                        }}/>

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
                            value={(totalStake * mult).toFixed(2)}
                            disabled
                            style={{
                              padding: '5px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              width: '130px',
                              backgroundColor: '#f5f5f5',
                              paddingLeft: '25px',
                            }}
                          />
                          <div style={{ position: 'absolute', top: '6px', left: '7px' }}>
                            <Coin size="16px" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button onClick = {handleParlaySubmit} style={{ backgroundColor: '#17408b', border: 'none', color: 'white', padding: '3%', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
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
    {isAuthenticated && <Betslip isModalOpen={isBetslipOpen} handleBetslipClick={handleBetslipClick} />}
    <div className="header-container" style={{ display: 'flex', alignItems: 'center', placeItems: 'center' }}>
      <h1>Live Scores</h1>
      <FaInfoCircle
        style={{ color: '#17408b', fontSize: '20px', marginLeft: '5px', verticalAlign: 'middle' }}
        data-tooltip-id="info-tooltip"
        data-tooltip-content="View live scores or predict game outcomes. Click the calendar icon to pick a date. 
        Displayed percentages for future games show the proportion of users backing each team to win."
      />
      <Tooltip id="info-tooltip"  multiline={true} multilineMaxWidth={500} 
      style={{ width: windowDimensions.width <= 768 ? windowDimensions.width : windowDimensions.width * 0.3 }}
       place = {windowDimensions.width <=768 ?  'top' :'right' }/>
    </div>
  <div className="date-navigation" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <button onClick={handlePreviousDay} className="day-btn">
    Previous Day
    </button>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ margin: '2%' }} className="date">{DateString}</span>
        <span>
            <label
                htmlFor="dateInput"
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    marginTop:'7px',
                }}
            >
                <FaCalendarAlt />
                <input
                    type="date"
                    id="dateInput"
                    value={DateString.split('/').reverse().join('-')}
                    onChange={handleSelectDay}
                    style={{
                        appearance: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        margin: 0,
                        padding: 0,
                        border: 'none',
                        zIndex:'10000',
                    }}
                />
            </label>
        </span>
    </div>
</div>

    <button onClick={handleNextDay} className="day-btn">
     Next Day
    </button>
</div>
    {loading ? <LoadingAnimation/> :
    liveGames.length > 0 ? (
      <div className="games-container">
        {liveGames.map((game) => {
         const prediction = userPredictions[game.id] || { homeTeamPercentage: 50, awayTeamPercentage: 50 };
          return (
            <div key={game.id} className="game-card">
              <div className="team">
                <img
                  src={require(`../images/${game.visitor_team.full_name.replace(/\s/g, "_")}.png`)}
                  className="team-logo"
                  alt={`${game.visitor_team.full_name} Logo`}
                />
                <span className="team-name">{game.visitor_team.full_name}</span>
                {/* <span className="score">{game.period > 0 ? game.visitor_team_score : `${parseFloat(prediction.awayTeamPercentage).toFixed(0)}%`}</span> */}
                {game.period === 0 && isCurrentDate(selectedDate) && (
                  <button
                    className={`day-btn-2 ${
                      selectedTeams[game.id]?.selected_team === game.visitor_team.full_name ? 'selected' : ''
                    }`}
                    onClick={(e) => handleSelectTeam(game.id, game.visitor_team, game, e)}
                  >
                    <FaTrophy />
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
               {/* <span className="score">
                  { 
                    game.period > 0
                    ? game.home_team_score
                    : `${parseFloat(prediction.homeTeamPercentage).toFixed(0)}%`
                  }
                </span> */}
                {game.period === 0 && isCurrentDate(selectedDate) && (
                  <button
                    className={`day-btn-2 ${
                      selectedTeams[game.id]?.selected_team === game.home_team.full_name ? 'selected' : ''
                    }`}
                    onClick={(e) => handleSelectTeam(game.id, game.home_team, game, e)}
                  >
                    <FaTrophy />
                  </button>
                )}
              </div>
              <div className="time-status">{getTimeStatus(game)}</div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="no-games">No games scheduled</p>
    )}
  </div>
);

  
};

export default ScoresBanner;
