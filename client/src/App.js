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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContextProvider, AuthContext } from "./Auth";



const AppContent = () => {
  const {setIsAuthenticated, setUser, user} = useContext(AuthContext);
  const [playerName, setPlayerName] = useState('');
  const [playerStats, setPlayerStats] = useState({});
  const [likedPlayers, setLikedPlayers] = useState([]);
  const [cardData, setCardData] = useState({})
  const [imgID, setImgID] = useState('');
  const [csv, setCsv] = useState([]);
  const [liveGames, setLiveGames] = useState([]);
  const [favoritePlayersVersion, setFavoritePlayersVersion] = useState(0);
  

  var imgLink = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${imgID}.png`

 
 
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
       const response = await fetch('http://localhost:4000/CheckUser', {
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
     const estOffset = -5 * 60; // Offset for Eastern Standard Time (EST) in minutes
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
     alert("Please enter year");
   } else if (!playerName) {
     alert("Please enter a valid player name and year");
   } else if (document.getElementById("year").value > 2022 
   || document.getElementById("year").value < 1979 ) {
     alert('Data is limited between the years 1979 to 2022')
    } else {
     getPlayerId();
     getImgID(playerName);
   }
 };
 
 
 
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
      alert("Please enter an NBA player's name");
    }
  };
  
 
  const getImgID = (name) => {
     for (let i=0;i<csv.length;i++) {
       if (csv[i][0].toLowerCase() === name.toLowerCase()) {
         setImgID(csv[i][6])
         return
       }
     }
  }
 
  const getImgIDLike = (name) => {
   for (let i=0;i<csv.length;i++) {
     if (csv[i][0].toLowerCase() === name.toLowerCase()) {
       return csv[i][6]
     }
   }
    
 
  }
 
 
  const getPlayerId = () => {
    axios
      .get(`https://www.balldontlie.io/api/v1/players?search=${playerName}`)
      .then(async (res) => {
        if (res.data.data[0] === undefined || res.data.data[0] === null) {
          alert("Player Not Found");
        } else if (res.data.data.length > 1) {
          alert("Incorrect Format. Ex: Stephen Curry");
        } else {
          getPlayerStats(res.data.data[0].id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
 
 
  const getPlayerStats = (playerId) => {
    axios
      .get(
        `https://www.balldontlie.io/api/v1/season_averages?season=${document.getElementById('year').value}&player_ids[]=${playerId}`
      )
      .then(async (res) => {
        if (res.data.data[0] === undefined) {
          alert('Player was injured or not playing this year')
          return
        }
         setPlayerStats(res.data.data[0]);
   
      })
      .catch((err) => {
        console.log(err);
      });
  };
 
 
 
 
 
 
  const PlayerCard = () => {
    return (
      <div className="card">
       <img alt = {'Image of ' + playerName } src= {imgLink} id="main-img"/> 
        <p>Points per game: {playerStats["pts"]}</p>
        <p>Assists per game: {playerStats["ast"]}</p>
        <p>Rebounds per game: {playerStats["reb"]}</p>
        <p>Steals per game: {playerStats["stl"]}</p>
        <p>Blocks per game: {playerStats["blk"]}</p>
        <p>Games played: {playerStats["games_played"]}</p>
        <button onClick={handleLike} className = "like-btn">Like</button>
      </div>
    );
  };
 
  const handleLikeCardClick = async(name) => {
    const res = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${name}`)
    setCardData(res.data.data[0])
  }
 
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
        alert('Added player to favorites');
      } else if (response.statusText === 'Unauthorized'){
        alert('Please log in or register to like player')
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

  
  
  
 
 var likedCardBack = <div></div>
 
 
 if (Object.keys(cardData).length !== 0 ) {
   likedCardBack = (
    <div className ='liked-player-card-2' onClick = {function() {
      setCardData('')
 
    }} >
     <p className = "lcb-p">{cardData.first_name + ' ' + cardData.last_name}</p>
     <p className = "lcb-p">{cardData.height_feet + '\''+ cardData.height_inches + '\"'}</p>
     <p className = "lcb-p">{cardData.weight_pounds + " lbs"}</p>
     <p className = "lcb-p">{cardData.team.full_name}</p>
     <button className='remove-btn' onClick={function () {
               handleRemove(cardData.first_name + ' ' + cardData.last_name);
             } }>Remove player</button>
    </div>
  )
 }
 
 
 
 
  const LikedPlayersTab = () => {
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
          <>
         
          {(cardData.first_name + ' ' + cardData.last_name) === likedPlayer && likedCardBack}
         { ((cardData.first_name + ' ' + cardData.last_name) !== likedPlayer && <div id={likedPlayer} className="liked-player-card"  onClick={function () {
 
            handleLikeCardClick(likedPlayer)
           
          }} >
           
 
             <div className="liked-player-front" id={likedPlayer}>
               <p className="like-name" key={index}>{likedPlayer}</p>
 
               <img alt = {'Image of ' + likedPlayer } className="like-img" src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${getImgIDLike(likedPlayer)}.png`} />
 
             </div>
           
 
             <button className='remove-btn' onClick={function () {
               handleRemove(likedPlayer);
             } }>Remove player</button>
 
           </div>)
         }
           </>
           
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
        <> 
          <div style ={{display:'flex', flexDirection:'row', justifyContent:'center', margin:'10px'}}>
            <input style ={{width:'120px', height: '48px', marginRight:'5px', padding: '0 auto'}} type="number" min="1979" max="2019" step="1" placeholder = "Enter year" id = "year"/>
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
          {playerStats && Object.keys(playerStats).length > 0 && (<PlayerCard handleLike={handleLike} />)}
        </>
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
/>

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