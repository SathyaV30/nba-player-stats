import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Papa from 'papaparse';
import "./App.css";
import Navbar from "./components/navbar";
import Compare from "./components/Compare";
import PageNotFound from "./components/PageNotFound";
import NBACsv from "./nba.csv";
import ScoresBanner from "./components/ScoresBanner";
import Login from "./components/Login";
import Register from "./components/Register";
import Post from "./components/Post";
import Posts from "./components/Posts";
import ProfilePage from "./components/Profile";
import Trivia from "./components/Trivia";
import MyPosts from "./components/MyPosts";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContextProvider, AuthContext } from "./Auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fallback from './images/fallback.png'
import Modal from 'react-modal';
import ReactCardFlip from 'react-card-flip';
import { Tooltip } from "react-tooltip";
import { FaInfoCircle } from "react-icons/fa";
import Leaderboard from "./components/Leaderboard";
import { backendUrl } from './config';
import Autocomplete from "./components/Autocomplete";
import LoadingAnimation from "./components/Loading";
import './components/ToggleSwitch.css'
import { convertMinutesToTotalMinutes } from "./components/Compare";
import { CSSTransition } from 'react-transition-group';
import { ThemeContext } from './Auth';


const App = () => {
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(savedTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme + '-theme');
  }, [theme]);

  return (
    <AuthContextProvider>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={theme + "-theme"}>
          <AppContent />
        </div>
      </ThemeContext.Provider>
    </AuthContextProvider>
  );
}

const AppContent = () => {
  const {isAuthenticated, setIsAuthenticated, setUser, user} = useContext(AuthContext);
  const [playerName, setPlayerName] = useState('');
  const [playerStats, setPlayerStats] = useState({});
  const [likedPlayers, setLikedPlayers] = useState([]);
  const [cardData, setCardData] = useState({});
  const [imgID, setImgID] = useState('');
  const [csv, setCsv] = useState([]);
  const [liveGames, setLiveGames] = useState([]);
  const [favoritePlayersVersion, setFavoritePlayersVersion] = useState(0);
  const [playerD, setPlayerD] = useState({});
  const [show, setShow] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
  const [likedPlayersLoading, setLikedPlayersLoading] = useState(false);
  const [showTotalStats, setShowTotalStats] = useState(false);
  const {theme} = useContext(ThemeContext)


  


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

  var imgLink = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${imgID}.png` 


  useEffect(()=> {
    setShow(false);
  },[playerName])



const handleOnError = (e) => {
    e.target.src = fallback;
}
 useEffect(() => {
   const fetchParseData = async () => {
     Papa.parse(NBACsv, {
       download:true,
       delimiter:"\n",
       complete: function(results) { 
           setCsv(results.data) 
       }
     })
   }
   fetchParseData()
 
 }, [])
 
 
 
 useEffect(() => {
   const checkUserLoggedIn = async () => {
     try {

       const response = await fetch(`${backendUrl}/CheckUser`, {
         credentials: 'include', 
       });
       const data = await response.json();
       if (data.username) {
         setUser(data.username)
         setIsAuthenticated(true);
       }
     } catch (error) {
       setIsAuthenticated(false);
       console.error('Failed to check if user is logged in');
     }
   };
   checkUserLoggedIn();
 }, []);
 
 
 
 
 
 useEffect(() => {
   const fetchLiveGames = async () => {
     const today = new Date();
     const estOffset = -5 * 60; 
     const estDate = new Date(today.getTime() + estOffset * 60 * 1000);
     const year = estDate.getFullYear();
     const month = String(estDate.getMonth() + 1).padStart(2, '0');
     const day = String(estDate.getDate()).padStart(2, '0');
     const date = `${year}-${month}-${day}`;
 
     try {
       const response = await axios.get(`https://www.balldontlie.io/api/v1/games?dates[]=${date}`);
       setLiveGames(response.data.data);
     } catch (error) {
       console.error('Error fetching live games:', error);
     }
   };
 
   fetchLiveGames();
 }, []);

 
 const handleSubmit = (e) => {

   e.preventDefault();
   if (document.getElementById("year").value.length === 0) {
    toast.error('Please enter year', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
   } else if (!playerName) {
    toast.error('Please enter a valid player name and year', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
   } else if (document.getElementById("year").value > 2023 
   || document.getElementById("year").value < 1979 ) {
    toast.error('Data is limited between 1979 and 2023', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    } else {
     
     getPlayerId();
     getImgID(playerName);
     playerHW(playerName);


     
     
   }
 };
 

 const playerHW = async (name) => {
  const res = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${name}`)
  setPlayerD(res.data.data[0])

 }
 
 
  const handleRandom = async (e) => {
 
   const randomId = Math.floor(Math.random() * 3092) + 1
 
   const {data} = await axios.get(`https://www.balldontlie.io/api/v1/players/${randomId}`)
   
 
   setPlayerName(data.first_name + ' ' + data.last_name)
  
   e.preventDefault();

 };
 
 
 const handleRemove = async (name) => {
  try {
    const response = await fetch(`${backendUrl}/RemoveFavoritePlayer`, {
      method: 'DELETE',
      credentials: 'include', 
      Authorization:'Bearer',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username:user, player:name})
      
    });
    
    if (response.ok) {
      toast.success(`Removed ${name} from favorites`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const updatedLikedPlayers = likedPlayers.filter(player => player !== name);
      setLikedPlayers(updatedLikedPlayers);
      setFavoritePlayersVersion(favoritePlayersVersion + 1);
      setCardData({});
    } else {
      throw new Error('Failed to remove player from favorites');
    }
  } catch (error) {
    console.error(error);
  }
};

 
  const handleChange = (event) => {
    const replace = event.target.value.split(" ").join(" ");
    if (replace.length >= 0) {
      setPlayerName(replace);
    } else {
      toast.error('Please enter an NBA Player\'s name', {
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
  
 
  const getImgID = (name) => {
     for (let i=0;i<csv.length;i++) {
       if (csv[i][0].toLowerCase() === name.toLowerCase()) {
         setImgID(csv[i][6]);
         return
       }
     }
     setImgID('')
  }
 
  const getImgIDLike = (name) => {
    
   for (let i=0;i<csv.length;i++) {
     if (csv[i][0].toLowerCase() === name.toLowerCase()) {
       return csv[i][6]
     }
   }

   return '';
    
 
  }
 
 
  const getPlayerId =  () => {
    axios
      .get(`https://www.balldontlie.io/api/v1/players?search=${playerName}`)
      .then(async (res) => {
        if (res.data.data[0] === undefined || res.data.data[0] === null) {
          toast.error('Player not found', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setShow(false);
          return;
        } else if (res.data.data.length > 1) {
          toast.error('Incorrect format. Ex: Stephen Curry', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setShow(false);
        } else {
          getPlayerStats(res.data.data[0].id);
        }
      })
      .catch((err) => {
        console.log(err);
        setShow(false)
      });
  };
 
 
  const getPlayerStats = async (playerId) => {
    axios
      .get(
        `https://www.balldontlie.io/api/v1/season_averages?season=${document.getElementById('year').value}&player_ids[]=${playerId}`
      )
      .then(async (res) => {
        if (res.data.data[0] === undefined) {
          toast.error('Player was injured or not playing this year', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setShow(false);
          return
        }

         setPlayerStats(res.data.data[0]);
         setShow(true);
   
      })
      .catch((err) => {
        console.log(err);
      });
  };
 

 
  
 
 
 
 
  const PlayerCard = () => {
    if (!playerD) {
      return
    }
    
    return (
      <div style ={{maxHeight:'470px', minHeight:'470px', margin:'10px', minWidth:'100%', maxWidth:'100%'}} >
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent:'center'}}>
    <div style ={{display:'flex', flexDirection:'column', alignItems: 'center'}}>
    <img alt={'Image of ' + playerName} src={imgLink} onError={handleOnError} id="main-img" style={{ marginRight: '20px',
    width:windowDimensions.width <=768 ? '230px' : '500px', objectFit:'cover' }} />
    <h1 style = {{margin:'5px'}}>{playerD.first_name + ' ' + playerD.last_name}</h1>
    {playerD.height_feet && playerD.height_inches && (
  <span style={{ margin: '5px' }}>
    {playerD.height_feet}'{playerD.height_inches}"
  </span>
)}
{playerD.weight_pounds && (
  <span style={{ margin: '5px' }}>
    {playerD.weight_pounds} lbs
  </span>
)}

<span style = {{margin:'5px'}}>
  {playerD && playerD.team && playerD.team.full_name}
</span>

    </div>
    <div
  style={{
    maxWidth: '35%',
    minWidth: '30%',
    maxHeight: '530px',
    overflow: 'overlay',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 auto',
  }}
>
  <table>
    <tbody>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'PTS' : 'Points'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["pts"] * playerStats["games_played"]) : playerStats["pts"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'AST' : 'Assists'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["ast"] * playerStats["games_played"]) : playerStats["ast"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'REB' : 'Rebounds'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["reb"] * playerStats["games_played"]) : playerStats["reb"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'STL' : 'Steals'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["stl"] * playerStats["games_played"]) : playerStats["stl"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'BLK' : 'Blocks'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["blk"] * playerStats["games_played"]) : playerStats["blk"]}</td>
      </tr>
      <tr>
        <td>Games played:</td>
        <td>{playerStats["games_played"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'MIN' : 'Minutes'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(convertMinutesToTotalMinutes(playerStats["min"]) * playerStats["games_played"]) : playerStats["min"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'FGM' : 'FG Made'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["fgm"] * playerStats["games_played"]) : playerStats["fgm"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'FGA' : 'FG Attempted'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["fga"] * playerStats["games_played"]) : playerStats["fga"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? '3PTM' : '3pt FG Made'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["fg3m"] * playerStats["games_played"]) : playerStats["fg3m"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? '3PTA' : '3pt FG Attempted'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["fg3a"] * playerStats["games_played"]) : playerStats["fg3a"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'FTM' : 'Free Throws Made'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["ftm"] * playerStats["games_played"]) : playerStats["ftm"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'FTA' : 'Free Throws Attempted'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["fta"] * playerStats["games_played"]) : playerStats["fta"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'OREB' : 'Offensive Rebounds'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["oreb"] * playerStats["games_played"]) : playerStats["oreb"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'DREB' : 'Defensive Rebounds'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["dreb"] * playerStats["games_played"]) : playerStats["dreb"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'TO' : 'Turnovers'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["turnover"] * playerStats["games_played"]) : playerStats["turnover"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'PF' : 'Personal Fouls'} {showTotalStats ? 'Total' : 'per game'}:</td>
        <td>{showTotalStats ? Math.round(playerStats["pf"] * playerStats["games_played"]) : playerStats["pf"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'FG%' : 'Field Goal %'}:</td>
        <td>{playerStats["fg_pct"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? '3PT%' : 'Three-Point Field Goal %'}:</td>
        <td>{playerStats["fg3_pct"]}</td>
      </tr>
      <tr>
        <td>{windowDimensions.width <= 768 ? 'FT%' : 'Free Throw Percentage %'}:</td>
        <td>{playerStats["ft_pct"]}</td>
      </tr>
    </tbody>
  </table>
  {isAuthenticated && (
    <button onClick={handleLike} className="like-btn">
      Like Player
    </button>
  )}
</div>



  </div>
</div>

    
    );
  };
 
 
  
  const handleLike = async () => {
    if (!playerName) {
      return;
    }
  
    if (likedPlayers.includes(playerName)) {
      return;
    }
  
    try {
      const response = await fetch(`${backendUrl}/AddFavoritePlayer`, {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName, username: user })
      });
      if (response.ok) {
        setLikedPlayers([...likedPlayers, playerName]);
        toast.success(`Added ${playerName} to favorites`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (response.statusText === 'Unauthorized'){
        toast.error('Please log in or register to like player', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } 
    } catch (error) {
      console.error(error);
    }
  };


  

  const fetchFavoritePlayers = async () => {
    setLikedPlayersLoading(true);
    try {
      const response = await fetch(`${backendUrl}/GetFavoritePlayers?username=${user}`, {
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data && data.favoritePlayers) {
        setLikedPlayers(data.favoritePlayers);
      } else {
        setLikedPlayers([]);
      }
    } catch (error) {
      console.error('Failed to fetch favorite players');
      setLikedPlayers([]);
    }
    setLikedPlayersLoading(false);
  };


  const handleToggleStatsType = () => {
    setShowTotalStats(!showTotalStats);
  };

  useEffect(() => {
    if (user) {
       fetchFavoritePlayers();
    }
  }, [user, favoritePlayersVersion]);  

  
  
  
 

 
 
 
 
  const LikedPlayersTab = () => {
    const [isFlipped, setIsFlipped] = useState({});
    const [cardData, setCardData] = useState([]);
  
    const handleFlip = async (likedPlayer) => {
      const res = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${likedPlayer}`)
      const playerData = res.data.data[0];
      
      setCardData(prevState => {
        const newData = [...prevState];
        const playerIndex = newData.findIndex(data => data.likedPlayer === likedPlayer);
  
        if (playerIndex !== -1) {
          newData[playerIndex] = {
            likedPlayer,
            playerData
          };
        } else {
          newData.push({
            likedPlayer,
            playerData
          });
        }
  
        return newData;
      });
  
      setIsFlipped(prevState => ({
        ...prevState,
        [likedPlayer]: !prevState[likedPlayer]
      }));
    };
  
    const LikedCardBack = (likedPlayer) => {
      const playerData = cardData.find(data => data.likedPlayer === likedPlayer);
  
      if (playerData) {
        const data = playerData.playerData;
  
        return (
          <div style ={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}} onClick={() => setCardData(prevState => prevState.filter(data => data.likedPlayer !== likedPlayer))}>
            <div style = {{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', minHeight:'200px', maxHeight:'200px'}}>
            <p className="lcb-p">{data.first_name + ' ' + data.last_name}</p>
            <p className="lcb-p">{data.height_feet ? data.height_feet + '\'' + data.height_inches + '\"' : "Height not available"}</p>
            <p className="lcb-p">{data.weight_pounds ? data.weight_pounds + " lbs" : "Weight not available"}</p>
            <p className="lcb-p">{data.team ? data.team.full_name : "Team not available"}</p>
            </div>
            <button className='remove-btn' onClick={() => handleRemove(data.first_name + ' ' + data.last_name)}>Remove player</button>
          </div>
        );
      } else {
        return null;
      }
    }
    if (likedPlayers.length === 0 && !likedPlayersLoading) {
      return (
       <div style ={{display:'flex', justifyContent:'center',flexDirection:'column'}}>
       <h1 style ={{textAlign:'center'}}>Liked Players</h1>
       <h2 style={{textAlign:'center'}}>No players liked</h2>
       </div>
      )
    }
    if (likedPlayersLoading) {
      return (
        <div style ={{display:'flex', justifyContent:'center',flexDirection:'column'}}>
       <h1 style ={{textAlign:'center'}}>Liked Players</h1>
         <LoadingAnimation/>
       </div>

      )
    }

    return (
      <div style ={{display:'flex', justifyContent:'center',flexDirection:'column'}}>
        <h1 style ={{textAlign:'center'}} >Liked Players</h1>
        <div style ={{display: 'flex',
          placeItems: 'center',
          flexWrap: 'wrap',
          flexDirection: windowDimensions.width <=768 ? 'column' : 'row',}}>
          {likedPlayers.map((likedPlayer, index) => (
            <ReactCardFlip isFlipped={isFlipped[likedPlayer]} flipDirection="horizontal">
              <div className="liked-player-card" id={likedPlayer} onClick={() => handleFlip(likedPlayer)}>
                <div className="liked-player-front" id={likedPlayer}>
                <div style = {{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', minHeight:'200px', maxHeight:'200px'}}>
                  <h3 style ={{fontWeight:'normal', whiteSpace:'nowrap', fontSize: 'clamp(10px, 17px, 30px)', width: 'fit-content',
  maxWidth: '100%'}} key={index}>{likedPlayer}</h3>
                  <img
                    alt={'Image of ' + likedPlayer}
                    className="like-img"
                    src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${getImgIDLike(likedPlayer)}.png`}
                    onError={handleOnError}
                  />
                  </div>
                  <button className='remove-btn' onClick={() => handleRemove(likedPlayer)}>Remove player</button>
                </div>
              </div>
  
              <div id={likedPlayer} className="liked-player-card" onClick={() => handleFlip(likedPlayer)}>
                {LikedCardBack(likedPlayer)}
              </div>
  
            </ReactCardFlip>
          ))}
        </div>
      </div>
    );
  };
  
  

  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={
    
        <div style ={{transform:'translateY(20px)'}}> 
          
          {playerStats && Object.keys(playerStats).length > 0 && (show && <PlayerCard handleLike={handleLike} /> )}

          {!show && 
          <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '470px',
            maxHeight: '470px',
            minWidth: '100%',
            maxWidth: '600px',
            overflow: 'auto',
            position: 'relative',
            margin: '10px',
            overflow: windowDimensions.width <= 768 ? 'hidden' : 'scroll',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
            }}
          >
            <p
              style={{
                fontSize: windowDimensions.width <= 768 ? '20px' : '24px',
                textAlign: 'center',
              }}
            >
              Enter year and player to view stats
            </p>
            <FaInfoCircle
              style={{ color: '#17408b', fontSize: '20px', marginLeft: '5px' }}
              data-tooltip-id="info-tooltip"
              data-tooltip-content="Year refers to the starting year of the season. For example, 2023 refers to the 2023-24 season."
            />
           <Tooltip 
            id="info-tooltip"
            place={windowDimensions.width <= 768 ? "bottom" : "right"}
            effect="solid"
            multiline={true}
            multilineMaxWidth={200} 
            style={{width:'200px', height: windowDimensions.width <= 768 ? '100px' : 'auto'}}
          />

          </div>
          
        </div>
        

        }
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '50px' }}>
  <form className="form-1" onSubmit={handleSubmit}>
    <div style={{ display: 'flex', flexDirection: windowDimensions.width <= 768 ? 'column' : 'row', justifyContent: 'center',alignItems:'center'}}>
      <input
        style={{ fontSize: '1.2em',
        padding: '10px',
        border: '0.8px solid #17408B',
        borderRadius: '5px',
        boxShadow: '0px 0px 1px #ccc',
        position: 'relative',
        width: windowDimensions.width <=768 ? windowDimensions.width * 0.6 : windowDimensions.width * 0.15,
        height:'48px',
      margin:'1%',
      backgroundColor: theme == 'light' ? '#f1f1f1' : '#353535',
      color: theme == 'light' ? '#353535' : '#e8e5e5',}}
        type="number"
        min="1979"
        max="2023"
        step="1"
        placeholder="Enter Year"
        id="year"
        
     
      />
    
        <Autocomplete setPlayerName={setPlayerName} value={playerName} onChange={handleChange} isComponentA = {false} />
          <div style = {{margin:windowDimensions.width <=768 ? '1%' : '0%'}}>
        <div className="toggle-container">
              <label className="switch-label">
                <input
                  type="checkbox"
                  onChange={handleToggleStatsType}
                  checked={showTotalStats}
                  className="switch-input"
                />
                <span className="switch-slider"></span>
              </label>
              <span className="toggle-text">{showTotalStats ? 'Total Stats' : 'Per Game Stats'}</span>
            </div>
            </div>
   
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
      <input className="like-btn" type="submit" value="Submit" style={{ marginRight: '5px' }} />
      <input type="button" value="Suprise Me" onClick={handleRandom} className="like-btn" />
    </div>
  </form>
</div>

        
        </div>
     
      }/>
     <Route
  path="/Favorites"
  key={favoritePlayersVersion}
  element={
    <AuthContext.Consumer>
      {({ isAuthenticated }) =>
        isAuthenticated ? (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <LikedPlayersTab />
          </div>
        ) : (
            <h1 style ={{textAlign:'center'}}>Please log in or register</h1>
        )
      }
    </AuthContext.Consumer>
  }
/>    <Route path ="/Leaderboard" element = {<Leaderboard/>}/>
      <Route path ="/MyPosts" element = {<MyPosts/>}/>
      <Route path ="/Posts" element = {<Posts />}/>
      <Route path="/Compare" element={<Compare />}/>
      <Route path="/Scores" element={<ScoresBanner />}/>
      <Route path="/Register" element={<Register />}/>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/Post" element ={<Post/>}/>
      <Route path="*" element={<PageNotFound />}/>
      <Route path='/Profile' element={<ProfilePage setFavoritePlayersVersion={setFavoritePlayersVersion}/>}/>
      <Route path ='/Trivia' element ={<Trivia/>}/>

      
    </Routes>
  </Router>
  );
};


export default App;