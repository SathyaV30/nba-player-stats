import axios from 'axios';
import { useState, useEffect } from 'react';
import { PlayerIdMap } from './PlayerIdMap';
import './ToggleSwitch.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingAnimation from './Loading';
import '../App.css';
import { convertMinutesToTotalMinutes, possibleStats } from './Compare';

    const LeagueLeaders = () => {
    const [leaders, setLeaders] = useState([]);
    const [year, setYear] = useState("");
    const [selectedStat, setSelectedStat] = useState("");
    const [numPlayers, setNumPlayers] = useState(10);
    const [apiUrls, setApiUrls] = useState([]);
    const [showTotalStats, setShowTotalStats] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
  
    const [windowDimensions, setWindowDimensions] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  
    useEffect(() => {
      const handleResize = () => {
        setWindowDimensions({width: window.innerWidth, height: window.innerHeight});
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    useEffect(() => {
      setSubmitted(false);
  
  
    }, [year,selectedStat,numPlayers,showTotalStats]);

     const handleToggleStatsType = () => {
      setShowTotalStats(!showTotalStats);
    };

    const getKeyLabel = (key) => {
        const stat = possibleStats.find((stat) => stat.key === key);
        return stat ? stat.label : '';
      };

     const handleSubmit = async (event) => {
      event.preventDefault();
      if (!selectedStat || !year || !numPlayers) {
        toast.error('Please enter all fields', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      } else if (year<1979 || year > 2022) {
        toast.error('Data is limited between 1979 and 2022', {
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
      createApiUrlsArray();
      setSubmitted(true); 
    };
     useEffect(() => {
      if (apiUrls.length > 0) {
        fetchPlayers();
      }
    }, [apiUrls]);
  
    const fetchPlayers = async () => {
      setIsLoading(true);
      const fetchedPlayers = [];
      try {
        for (let i = 0; i < apiUrls.length; i++) {
          const response = await axios.get(apiUrls[i]);
          const data = response.data.data;
          fetchedPlayers.push(...data);
        }
      
        fetchedPlayers.sort((a, b) => {
          if (selectedStat === "min") {
            const aValue = showTotalStats ? convertMinutesToTotalMinutes(a[selectedStat]) * a.games_played : convertMinutesToTotalMinutes(a[selectedStat]);
            const bValue = showTotalStats ? convertMinutesToTotalMinutes(b[selectedStat]) * b.games_played : convertMinutesToTotalMinutes(b[selectedStat]);
            return bValue - aValue;
          } else {
            const aValue = showTotalStats ? a[selectedStat] * a.games_played : a[selectedStat];
            const bValue = showTotalStats ? b[selectedStat] * b.games_played : b[selectedStat];
            return bValue - aValue;
          }
        });
    
        const topPlayers = fetchedPlayers.slice(0, numPlayers);
      
        setLeaders(topPlayers);
        setIsLoading(false);
      } catch (error) {
          toast.error('There was an error fetching players. Please try again in one minute', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setIsLoading(false);
        setSubmitted(false);
      }
    };
  
  
  
     const createApiUrlsArray = () => {
      const baseUrl = `https://www.balldontlie.io/api/v1/season_averages`;
      const perPage = 100;
      const playerIds = Object.keys(PlayerIdMap);
      const apiUrl = `${baseUrl}?per_page=${perPage}&season=${year}&player_ids[]=`;
       let urlsArray = [];
      let url = apiUrl;
      const maxCharacterCount = 8000;
      const maxLength = maxCharacterCount - url.length;
       playerIds.forEach((playerId, index) => {
        const playerIdParam = `${playerId}&player_ids[]=`;
        if (url.length + playerIdParam.length <= maxCharacterCount) {
          url += playerIdParam;
        } else {
          urlsArray.push(url);
          url = `${apiUrl}${playerId}&player_ids[]=`;
        }
      });
      urlsArray.push(url);
      setApiUrls(urlsArray);
    };
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '20px',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: windowDimensions.width <= 768 ? 'column' : 'row',
          alignItems: windowDimensions.width <= 768 ? 'center' : 'none',
          width: '80%',
          maxWidth: '800px', 
          height: windowDimensions.height * 0.8
        }}>
          <div style={{ flex: '1', marginRight: '20px' }}>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="year" style={{ marginRight: '10px' }}>Year:</label>
                <input
                  type="text"
                  id="year"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  style={{ flex: '1 0 200px', margin: '0 10px', padding: '5px', borderRadius: '4px', border: '1px solid #17408b' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
    <label htmlFor="stat" style={{ marginRight: '10px' }}>Stat Category:</label>
    <select
      id="stat"
      value={selectedStat}
      onChange={(event) => setSelectedStat(event.target.value)}
      style={{
        flex: '1 0 200px', 
        margin: '0 10px',
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #17408b',
        overflow: 'hidden'
      }}
    >
      <option value="">Select a stat</option>
      {possibleStats.map((stat) => (
        <option key={stat.key} value={stat.key}>
          {stat.label}
        </option>
      ))}
    </select>
  </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="numPlayers" style={{ marginRight: '10px' }}>Number of Players:</label>
                <input
                  type="number"
                  id="numPlayers"
                  min="1"
                  value={numPlayers}
                  onChange={(event) => setNumPlayers(parseInt(event.target.value))}
                  style={{ flex: '1 0 200px', margin: '0 10px', padding: '5px', borderRadius: '4px', border: '1px solid #17408b' }}
                />
              </div>
              <div style ={{display: 'flex', flexDirection:'row', justifyContent:'center'}}>
                <button type="submit" style={{ backgroundColor: '#17408b', color: 'white', border: 'none', cursor: 'pointer', fontSize: '18px', margin: '10px', padding: '10px', borderRadius: '5px' }}>Submit</button>
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
                  <span className="toggle-text">
                    {showTotalStats ? 'Total Stats' : 'Per Game Stats'}
                  </span>
                </div>
              </div>
            </form>
          </div>
          <div className="llb" style={{flex:'1'}}>
            {!submitted || !numPlayers || !year || !selectedStat ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minWidth:windowDimensions.width*0.2, maxWidth: windowDimensions.width, minHeight: '400px', maxHeight: windowDimensions.height }}>
                <p>Enter a year and a stat to view the top players of that season</p>
              </div>
            ) : isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minWidth:'400px', maxWidth: windowDimensions.width, minHeight: '400px', maxHeight: windowDimensions.height }}>
                <LoadingAnimation/>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth:'400px', maxWidth: windowDimensions.width, maxHeight: '80vh', overflow:'auto' }}>
                <span style={{ margin: '5px' }}>
                  Top {numPlayers} {getKeyLabel(selectedStat)} {showTotalStats ? 'total' : 'per game'} of the {year} season:
                </span>
                {leaders.map((leader, index) => (
                  <div key={leader.player_id} style={{ marginBottom: '10px'}}>
                    <span style={{ fontWeight: 'bold', marginRight:'4px' }}>{index + 1}.</span><span>{PlayerIdMap[leader.player_id]}:</span>
                    <span style ={{marginRight:'2px'}}> {showTotalStats && selectedStat === "min" && Math.round(convertMinutesToTotalMinutes(leader[selectedStat]) * leader.games_played)}{showTotalStats  && selectedStat!=="min" && Math.ceil(leader[selectedStat] * leader.games_played)} </span> <span>{!showTotalStats && leader[selectedStat]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
    
  };
  
export default LeagueLeaders;  