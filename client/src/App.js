import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from 'papaparse';
import "./App.css";
import Navbar from "./components/navbar";
import Compare from "./components/Compare";
import PageNotFound from "./components/PageNotFound";
import NBACsv from "./nba.csv";
import ScoresBanner from "./components/ScoresBanner";




const App = () => {
  
 const [playerName, setPlayerName] = useState(null);
 const [playerStats, setPlayerStats] = useState({});
 const [likedPlayers, setLikedPlayers] = useState(JSON.parse(localStorage.getItem('likedPlayers')) || []);
 const [cardData, setCardData] = useState({})
 const [imgID, setImgID] = useState('');
 const [csv, setCsv] = useState([]);
 const [liveGames, setLiveGames] = useState([]);
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


const handleRemove = (name) => {
  
  const updatedLikedPlayers = likedPlayers.filter(player => player !== name)
  setLikedPlayers(updatedLikedPlayers)
  setCardData({})

}

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

 const handleLike = () => {
   if (!playerName) {
     return
   }

   if (likedPlayers.includes(playerName) ) {
     return;
   }
   setLikedPlayers([...likedPlayers, playerName]);
   alert('Added player to favorites')
 };

 useEffect(() => {

  localStorage.setItem('likedPlayers', JSON.stringify(likedPlayers));
  
}, [likedPlayers]);

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
      <><h1>Liked Players</h1>
      <h2>No players liked</h2></>)
   }
    return (
      <><h1>Liked Players</h1>
      
      
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

     
     
      </>
   );
 };

 let component;
 switch (window.location.pathname) {
   case  "/":
     return (

    <div className="App">
    <Navbar/>
    
       <input type="number" min="1979" max="2019" step="1" placeholder = "Enter year" className ="year-input" id = "year"/>
    <form className ="form-1" onSubmit={handleSubmit}>
      <label>
        <input
          type="text"
          value={playerName}
          onChange={handleChange}
          placeholder="Please enter an NBA player's name"
          style={{marginRight:'5px'}}
        />
      </label>
      <input className = "submit" type="submit" value="Submit" style={{marginRight:'5px'}}/>
      <input type="button" value="Suprise Me" onClick = {handleRandom} className = "like-btn"/>
     
      </form>
      
      {
         playerStats && Object.keys(playerStats).length > 0 && (
          <PlayerCard handleLike={handleLike} />
        )
    }

     </div>
  )
   

   case "/Favorites":
   component = <LikedPlayersTab/>
   break

   case "/Compare":
   component = <Compare/>
   break

   case "/Scores": 
   component = <ScoresBanner/>
   break

   default:
   component =<PageNotFound/>
   break


 }

 

 
 return (
   <div className="App">
      <Navbar></Navbar>
      {component}
   </div>
 );
 }
export default App;


