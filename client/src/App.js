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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fallback from './images/fallback.png'
import Modal from 'react-modal';
import ReactCardFlip from 'react-card-flip';
import { Tooltip } from "react-tooltip";
import { FaInfoCircle } from "react-icons/fa";
import Leaderboard from "./components/Leaderboard";
import { backendUrl } from './config';




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
   } else if (document.getElementById("year").value > 2022 
   || document.getElementById("year").value < 1979 ) {
    toast.error('Data is limited between 1979 and 2022', {
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
    const response = await fetch('http://localhost:4000/RemoveFavoritePlayer', {
      method: 'DELETE',
      credentials: 'include', 
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
    <img alt={'Image of ' + playerName} src={imgLink} onError={handleOnError} id="main-img" style={{ marginRight: '20px',width:'500px', objectFit:'cover' }} />
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

     <span style = {{margin:'5px'}}>{playerD.team.full_name}</span>
   
    </div>
    <div style={{ maxWidth:'20%', minWidth:'30%', maxHeight: '530px', overflow:'overlay', alignItems:'center', display:'flex', flexDirection:'column', padding: '0 auto'}}>
      <table>
        <tbody>
          <tr>
            <td>Points per game:</td>
            <td>{playerStats["pts"]}</td>
          </tr>
          <tr>
            <td>Assists per game:</td>
            <td>{playerStats["ast"]}</td>
          </tr>
          <tr>
            <td>Rebounds per game:</td>
            <td>{playerStats["reb"]}</td>
          </tr>
          <tr>
            <td>Steals per game:</td>
            <td>{playerStats["stl"]}</td>
          </tr>
          <tr>
            <td>Blocks per game:</td>
            <td>{playerStats["blk"]}</td>
          </tr>
          <tr>
            <td>Games played:</td>
            <td>{playerStats["games_played"]}</td>
          </tr>
          <tr>
            <td>Minutes per game:</td>
            <td>{playerStats["min"]}</td>
          </tr>
          <tr>
            <td>FG Made per game:</td>
            <td>{playerStats["fgm"]}</td>
          </tr>
          <tr>
            <td>FG Attempted per game:</td>
            <td>{playerStats["fga"]}</td>
          </tr>
          <tr>
            <td>3pt FG Made per game:</td>
            <td>{playerStats["fg3m"]}</td>
          </tr>
          <tr>
            <td>3pt FG Attempted per game:</td>
            <td>{playerStats["fg3a"]}</td>
          </tr>
          <tr>
            <td>Free Throws Made per game:</td>
            <td>{playerStats["ftm"]}</td>
          </tr>
          <tr>
            <td>Free Throws Attempted per game:</td>
            <td>{playerStats["fta"]}</td>
          </tr>
          <tr>
            <td>Offensive Rebounds per game:</td>
            <td>{playerStats["oreb"]}</td>
          </tr>
          <tr>
            <td>Defensive Rebounds per game:</td>
            <td>{playerStats["dreb"]}</td>
          </tr>
          <tr>
            <td>Turnovers per game:</td>
            <td>{playerStats["turnover"]}</td>
          </tr>
          <tr>
            <td>Personal Fouls per game:</td>
            <td>{playerStats["pf"]}</td>
          </tr>
          <tr>
            <td>Field Goal %:</td>
            <td>{playerStats["fg_pct"]}</td>
          </tr>
          <tr>
            <td>Three-Point Field Goal %:</td>
            <td>{playerStats["fg3_pct"]}</td>
          </tr>
          <tr>
            <td>Free Throw Percentage %:</td>
            <td>{playerStats["ft_pct"]}</td>
          </tr>
        </tbody>
      </table>
     {isAuthenticated && <button onClick={handleLike} className="like-btn">Like Player</button> }
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
      const response = await fetch('http://localhost:4000/AddFavoritePlayer', {
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
    try {
      const response = await fetch(`http://localhost:4000/GetFavoritePlayers?username=${user}`, {
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
    if (likedPlayers.length === 0) {
      return (
       <div style ={{display:'flex', justifyContent:'center',flexDirection:'column'}}>
       <h1 style ={{textAlign:'center'}}>Liked Players</h1>
       <h2 style={{textAlign:'center'}}>No players liked</h2>
       </div>
      )
    }

    return (
      <div style ={{display:'flex', justifyContent:'center',flexDirection:'column'}}>
        <h1 style ={{textAlign:'center'}} >Liked Players</h1>
        <div className="all-cards">
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

          {!show && <div
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
            margin:'10px',
          }}
        >
          <p
            style={{
              fontSize: '24px',
              textAlign: 'center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
            }}
          >
            Enter year and player to view stats
          </p>
                  <FaInfoCircle
                    style={{ color: '#17408b', fontSize: '20px', marginLeft: '5px', transform: 'translate(210px,25px)' }}
                    data-tooltip-id="info-tooltip"
                    data-tooltip-content="Year refers to the starting year of the season. For example, 2022 refers to the 2022-23 season"
                  />
                  <Tooltip id="info-tooltip" />
         
        </div>}
          <div style ={{display:'flex', flexDirection:'row', justifyContent:'center', margin:'50px'}}>
            <input style ={{width:'120px', height: '48px', marginRight:'5px', padding: '0 auto'}} type="number" min="1979" max="2022" step="1" placeholder = "Enter year" id = "year"/>
            <form className ="form-1" onSubmit={handleSubmit}>
              <label>
                <input
                  type="text"
                  value={playerName}
                  onChange={handleChange}
                  placeholder="Please enter an NBA player's name"
                  style={{marginRight:'5px'}}
                  className = "txt_input"
                />
              </label>
              <input className = "submit" type="submit" value="Submit" style={{marginRight:'5px'}}/>
              <input type="button" value="Suprise Me" onClick = {handleRandom} className = "like-btn"/>
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


const App = () => {
 return ( 

  <AuthContextProvider>
 <AppContent />
</AuthContextProvider>
);

}

export default App;