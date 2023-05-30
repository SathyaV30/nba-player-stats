import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../Auth";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { Tooltip } from 'react-tooltip'
import { FaTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import 'react-tooltip/dist/react-tooltip.css'
import NBACsv from "../nba.csv";
import Papa from 'papaparse';
import NBA from '../images/NBA.png';
import Hawks from '../images/Atlanta_Hawks.png';
import Celtics from '../images/Boston_Celtics.png';
import Nets from '../images/Brooklyn_Nets.png';
import Hornets from '../images/Charlotte_Hornets.png';
import Bulls from '../images/Chicago_Bulls.png';
import Cavaliers from '../images/Cleveland_Cavaliers.png';
import Mavericks from '../images/Dallas_Mavericks.png';
import Nuggets from '../images/Denver_Nuggets.png';
import Pistons from '../images/Detroit_Pistons.png';
import Warriors from '../images/Golden_State_Warriors.png';
import Rockets from '../images/Houston_Rockets.png';
import Pacers from '../images/Indiana_Pacers.png';
import Clippers from '../images/LA_Clippers.png';
import Lakers from '../images/Los_Angeles_Lakers.png';
import Grizzlies from '../images/Memphis_Grizzlies.png';
import Heat from '../images/Miami_Heat.png';
import Bucks from '../images/Milwaukee_Bucks.png';
import Timberwolves from '../images/Minnesota_Timberwolves.png';
import Pelicans from '../images/New_Orleans_Pelicans.png';
import Knicks from '../images/New_York_Knicks.png';
import Thunder from '../images/Oklahoma_City_Thunder.png';
import Magic from '../images/Orlando_Magic.png';
import Sixers from '../images/Philadelphia_76ers.png';
import Suns from '../images/Phoenix_Suns.png';
import Blazers from '../images/Portland_Trail_Blazers.png';
import Kings from '../images/Sacramento_Kings.png';
import Spurs from '../images/San_Antonio_Spurs.png';
import Raptors from '../images/Toronto_Raptors.png';
import Jazz from '../images/Utah_Jazz.png';
import Wizards from '../images/Washington_Wizards.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fallback from '../images/fallback.png';
import ReactCardFlip from 'react-card-flip';

const teamLogos = {
  'Atlanta Hawks': Hawks,
  'Boston Celtics': Celtics,
  'Brooklyn Nets': Nets,
  'Charlotte Hornets': Hornets,
  'Chicago Bulls': Bulls,
  'Cleveland Cavaliers': Cavaliers,
  'Dallas Mavericks': Mavericks,
  'Denver Nuggets': Nuggets,
  'Detroit Pistons': Pistons,
  'Golden State Warriors': Warriors,
  'Houston Rockets': Rockets,
  'Indiana Pacers': Pacers,
  'LA Clippers': Clippers,
  'Los Angeles Lakers': Lakers,
  'Memphis Grizzlies': Grizzlies,
  'Miami Heat': Heat,
  'Milwaukee Bucks': Bucks,
  'Minnesota Timberwolves': Timberwolves,
  'New Orleans Pelicans': Pelicans,
  'New York Knicks': Knicks,
  'Oklahoma City Thunder': Thunder,
  'Orlando Magic': Magic,
  'Philadelphia 76ers': Sixers,
  'Phoenix Suns': Suns,
  'Portland Trail Blazers': Blazers,
  'Sacramento Kings': Kings,
  'San Antonio Spurs': Spurs,
  'Toronto Raptors': Raptors,
  'Utah Jazz': Jazz,
  'Washington Wizards': Wizards,
};



const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

const styles = {
  progressContainer: {
    height: '20px',
    width: '100%',
    margin: '10px 0',
  },
  
  progress: {
    height: '100%',
    borderRadius: 'inherit',
    transition: 'width .2s ease-in',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    width:'100%',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    margin: '10px 0',
    padding: '10px',
    width: '100%',
    backgroundColor: '#17408B',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    margin: 'auto',
  },
  header: {
    color: 'black',
    margin: '10px 0',
  },
  quill: {
    margin: '10px 0',
    padding: '10px',
    width: '100%',
    borderColor: 'lightgrey',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  playerContainer: {
    minWidth: '100%',
    maxWidth:'100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '10px',
    flexDirection: 'row',
    flexWrap: 'wrap',
    

  },player: {
    margin: '10px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column', 
    border: '1px solid lightgrey', 
    borderRadius: '8px',
    padding: '10px', 
    minHeight: '200px',
    position: 'relative', 
    minWidth:'130px',
    maxWidth:'130px',
    overflow:'hidden',
    cursor:'pointer',
  },
  playerImage: {
    width: '100px', 
    height: '100px', 
    borderRadius: '50%', 
    margin: '10px auto', 
    objectFit: 'cover',
    border: '1px solid lightgrey',
  },
  removeIcon: {
    position: 'absolute',
    top: '5px', 
    right: '5px',
    display: 'none',
    cursor: 'pointer',
    color: '#17408b',
  },
  playerName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }  
};

function ProfilePage({ setFavoritePlayersVersion }) {
  const [bio, setBio] = useState('');
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const {setUser, user, setIsAuthenticated} = useContext(AuthContext);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [csv, setCsv] = useState(null);
  const [tqc, setTqc] = useState(0);
  const [tqa, setTqa] = useState(0); 
  const [isFlipped, setIsFlipped] = useState({});
  const [playerData, setPlayerData] = useState({});
  const defaultTeamLogo = <img src={NBA} alt="team logo" height="30px" style={{ objectFit: 'cover' }} />;


  useEffect(() => {
    const fetchPlayerData = async () => {
      for (const player of favoritePlayers) {
        const res = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${player}`);
        setPlayerData(prevState => ({
          ...prevState,
          [player]: res.data.data[0]
        }));
      }
    };

    fetchPlayerData();
  }, [favoritePlayers]);

  const handleFlip = (player) => {
    setIsFlipped(prevState => ({
      ...prevState,
      [player]: !prevState[player]
    }));
  };

  function calcFontSize(name) {
    if (name.length <= 10) {
      return 14;
    } else if (name.length <= 15) {
      return 12;
    } else {
      return 10;
    }
  }

  const getImgID = (name) => {
    for (let i=0;i<csv.length;i++) {
      if (csv[i][0].toLowerCase() === name.toLowerCase()) {
        return csv[i][6]
      }
    }
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


  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:4000/Userdata', {
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
      });
      const data = await res.json();
      setBio(data.bio);
      setFavoriteTeam(data.favoriteTeam);
      setFavoritePlayers(data.favoritePlayers);
      setTqa(data.TriviaQuestionsAnswered);
      setTqc(data.TriviaQuestionsCorrect);
  
    };
  
    fetchData();
  }, []);
  

  const handleUpdate = async () => {
    const res = await fetch('http://localhost:4000/UpdateUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio, favoriteTeam, favoritePlayers }),
      credentials:'include',
    });

    if (res.ok) {
      toast.success('Profile updated successfully', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error('There was an error updating your profile', {
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

  const handleRemovePlayer = async (name) => {
    getImgID(name);
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
        setFavoritePlayers(prevPlayers => prevPlayers.filter(player => player !== name));
        setFavoritePlayersVersion(prevVersion => prevVersion + 1);
        
      } else {
        throw new Error('Failed to remove player from favorites');
    }
  } catch (error) {
    console.error(error);
  }
};

const handleLogout = async () => {
  try {
    setIsAuthenticated(false);
    setUser('');
    const response = await fetch('http://localhost:4000/Logout', {
      method: 'GET',
      credentials: 'include', 
    });

    if (response.ok) {
      toast.success('Logged out successfully', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error('Failed to logout', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    navigate('/');
  } catch (error) {
    console.error('Failed to log out', error);
  }
};


return (
  <div style={styles.container}>
    <h1>Welcome, {user}!</h1>
    <h2 style={styles.header}>Bio</h2>
    <ReactQuill
      value={bio}
      onChange={setBio}
      modules={modules}
      style={styles.quill}
    />
    <h2 style={styles.header}>Favorite Team</h2>
    <div style={{ display: 'flex', flexDirection: 'row', placeItems: 'center' }}>
  {favoriteTeam && favoriteTeam.length > 0  && (
    <img
      src={teamLogos[favoriteTeam]}
      alt="team logo"
      height="30px"
      style={{ objectFit: 'cover' }}
      onError = {(e) => {e.target.src = NBA}}
    />
  )}
  <select
    style={styles.input}
    id="favoriteTeam"
    value={favoriteTeam}
    onChange={(e) => setFavoriteTeam(e.target.value)}
  >
        <option value="">Select a team</option>
        <option value="Atlanta Hawks">Atlanta Hawks</option>
        <option value="Boston Celtics">Boston Celtics</option>
        <option value="Brooklyn Nets">Brooklyn Nets</option>
        <option value="Charlotte Hornets">Charlotte Hornets</option>
        <option value="Chicago Bulls">Chicago Bulls</option>
        <option value="Cleveland Cavaliers">Cleveland Cavaliers</option>
        <option value="Dallas Mavericks">Dallas Mavericks</option>
        <option value="Denver Nuggets">Denver Nuggets</option>
        <option value="Detroit Pistons">Detroit Pistons</option>
        <option value="Golden State Warriors">Golden State Warriors</option>
        <option value="Houston Rockets">Houston Rockets</option>
        <option value="Indiana Pacers">Indiana Pacers</option>
        <option value="LA Clippers">LA Clippers</option>
        <option value="Los Angeles Lakers">Los Angeles Lakers</option>
        <option value="Memphis Grizzlies">Memphis Grizzlies</option>
        <option value="Miami Heat">Miami Heat</option>
        <option value="Milwaukee Bucks">Milwaukee Bucks</option>
        <option value="Minnesota Timberwolves">Minnesota Timberwolves</option>
        <option value="New Orleans Pelicans">New Orleans Pelicans</option>
        <option value="New York Knicks">New York Knicks</option>
        <option value="Oklahoma City Thunder">Oklahoma City Thunder</option>
        <option value="Orlando Magic">Orlando Magic</option>
        <option value="Philadelphia 76ers">Philadelphia 76ers</option>
        <option value="Phoenix Suns">Phoenix Suns</option>
        <option value="Portland Trail Blazers">Portland Trail Blazers</option>
        <option value="Sacramento Kings">Sacramento Kings</option>
        <option value="San Antonio Spurs">San Antonio Spurs</option>
        <option value="Toronto Raptors">Toronto Raptors</option>
        <option value="Utah Jazz">Utah Jazz</option>
        <option value="Washington Wizards">Washington Wizards</option>
    </select>
    </div>

    <h2 style={styles.header}>Favorite Players</h2>
    <div style ={{display:'flex', flexDirection:'row', justifyContent: 'center'}}>
    <div style={styles.playerContainer}>
      {favoritePlayers.length !== 0 ? (
        favoritePlayers.map((player, index) => (
          <ReactCardFlip isFlipped={isFlipped[player] || false} flipDirection="horizontal" key={index}>
            <div 
              style={styles.player}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => handleFlip(player)}
            >
              <FaTimes
                style={index === hoverIndex ? { ...styles.removeIcon, display: 'block' } : styles.removeIcon}
                onClick={() => handleRemovePlayer(player, index)}
              />
              <p style={{ ...styles.playerName, fontSize: calcFontSize(player) }}>{player}</p>
              <img
                style={styles.playerImage}
                src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${getImgID(player)}.png`}
                onError={(e) => {
                  e.target.src = fallback;
                }}
                alt="player"
              />
            </div>
            
            <div  
            style={styles.player} 
            onClick={() => handleFlip(player)}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            
            > 
            <FaTimes
                style={index === hoverIndex ? { ...styles.removeIcon, display: 'block' } : styles.removeIcon}
                onClick={() => handleRemovePlayer(player, index)}
              />
            
               {playerData[player] && (
                <div style ={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                  <p style={{ ...styles.playerName, fontSize: calcFontSize(player) }}>{playerData[player].first_name + ' ' + playerData[player].last_name}</p>
                  <p style={{ ...styles.playerName, fontSize: calcFontSize(player) }}>{playerData[player].height_feet + '\'' + playerData[player].height_inches + '\"'}</p>
                  <p style={{ ...styles.playerName, fontSize: calcFontSize(player) }}>{playerData[player].weight_pounds + ' lbs'}</p>
                  <p style={{ ...styles.playerName, fontSize: calcFontSize(player) }}>{playerData[player].team.full_name}</p>
                </div>
    )}
              
            </div>
          </ReactCardFlip>
        ))
      ) : (
        <span>None</span>
      )}
    </div>
  
      </div>
      <div>
  <h2 style={{textAlign:'center'}}>Trivia Stats</h2>
  <p> Trivia questions answered: {tqa} </p>
 <div style={{ 
    width: '100%',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    display: 'flex'
  }}>
    {tqa !== 0 && (
      <>
        <div style={{ width: `${((tqc / tqa) * 100).toFixed(2)}%`, float: 'left', borderRadius: '50px' }}>
          <div 
            data-tooltip-id="correctTooltip"
            data-tooltip-content={`${((tqc / tqa) * 100).toFixed(2)}% Correct `}
            style={{
              display: 'inline-block',
              backgroundColor: '#228B22',
              width: '100%',
              height: '40px', 
              borderRadius: '10px 0px 0px 10px' 
            }}
          />
         <div style={{display:'flex', alignItems:'center', textAlign: 'center', whiteSpace: 'nowrap', color: '#228B22' }}><span>{tqc}</span><FaCheckCircle style={{ display: 'inline-flex', alignItems: 'center', marginLeft:'3px', flexShrink:'0'}} /></div>
</div>

<div style={{ width: `${((1 - (tqc / tqa)) * 100).toFixed(2)}%`, float: 'left', borderRadius: '50px' }}>
  <div
    data-tooltip-id="incorrectTooltip"
    data-tooltip-content={`${((1 - (tqc / tqa)) * 100).toFixed(2)}% Incorrect`}
    style={{
      display: 'inline-block',
      backgroundColor: '#DC143C',
      width: '100%',
      height: '40px',
      borderRadius: '0px 10px 10px 0px'
    }}
  />
  <div style={{ display:'flex', alignItems:'center',textAlign: 'center', whiteSpace: 'nowrap', color: '#DC143C' }}> <span>{tqa - tqc}</span> <FaTimesCircle style={{ display: 'inline-flex', alignItems: 'center', marginLeft:'3px', flexShrink:'0' }} /> </div>
</div>

      </>
    )}
    <Tooltip id="correctTooltip" />
    <Tooltip id="incorrectTooltip" />
  </div>

    </div>

    <button style={styles.button} onClick={handleUpdate}>
      Update Profile
    </button>
    <button style={styles.button} onClick={handleLogout}>
      Logout
    </button>
  </div>
);
}

export default ProfilePage;

