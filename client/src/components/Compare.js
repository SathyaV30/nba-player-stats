import axios from 'axios';
import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import Modal from 'react-modal';
import { PlayerIdMap } from './PlayerIdMap';
import './ToggleSwitch.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingAnimation from './Loading';
import Autocomplete from './Autocomplete';
import '../App.css'

const fgOptions = {
  scales: {
    x: {
      type: 'category',
    },
    y: {
      type: 'linear',
    },
  },
  maintainAspectRatio: false,
  responsive: true,
};

const styles = {
  comparePanelStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    width: '100%',
  },
  chartContainerStyle: {
    width: '100%',
    height: '400px',
  },
  inputContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  inputRowStyle: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  inputStyle: {
    flex: '1 0 calc(33% - 20px)',
    margin: '0 10px',
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #17408b',
  },
  buttonStyle: {
    backgroundColor: '#17408b',
    color:'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    margin: '10px',
    padding:'10px',
    borderRadius:'5px',
  },
  statsCheckboxesStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  checkboxLabelStyle: {
    marginRight: '10px',
  },
  switchLabel: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60px',
    height: '24px',
    marginRight: '8px',
  },
  toggleText: {
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
  },
};

const possibleStats = [
  { key: 'pts', label: 'Points' },
  { key: 'reb', label: 'Rebounds' },
  { key: 'oreb', label: 'Offensive Rebounds' },
  { key: 'dreb', label: 'Defensive Rebounds' },
  { key: 'ast', label: 'Assists' },
  { key: 'stl', label: 'Steals' },
  { key: 'blk', label: 'Blocks' },
  { key: 'fg_pct', label: 'Field Goal %' },
  { key: 'fg3_pct', label: 'Three-Point %' },
  { key: 'ft_pct', label: 'Free Throw %' },
  { key: 'games_played', label: 'Games Played' },
  { key: 'turnover', label: 'Turnovers' },
  { key: 'fgm', label: 'Field Goals Made'},
  { key: 'fga', label: 'Field Goals Attempted'},
  { key: 'ftm', label: 'Free Throws Made'},
  { key: 'fta', label: 'Free Throws Attempted'},
  { key: 'fg3m', label: 'Three-Point Field Goals Made'},
  { key: 'fg3a', label: 'Three-Point Field Goals Attempted'},
  { key: 'pf', label: 'Personal Fouls' },
  { key: 'min', label: 'Minutes Played' },

];

const Compare = () => {

  const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
  const [playersData, setPlayersData] = useState([]);
  const [playerInputs, setPlayerInputs] = useState([{ id: 1, playerName: '', startYear: '', endYear: '' }]);
  const [selectedStats, setSelectedStats] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Individual');
  const [showTotalStats, setShowTotalStats] = useState(false);
  const [tooManyRequests, setTooManyRequests] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [playerInputsCopy, setPlayerInputsCopy] = useState([]);

  const convertMinutesToTotalMinutes = (minutes) => {
    const [min, sec] = minutes.split(":");
    return parseInt(min) + parseInt(sec) / 60;
  };

  const getKeyLabel = (key) => {
    const stat = possibleStats.find((stat) => stat.key === key);
    return stat ? stat.label : '';
  };
  
const Conditions = () => {


    const operators = ['<', '<=', '=', '>', '>='];
    const [year, setYear] = useState(null);
    const [conditions, setConditions] = useState([{ key: '', value: '', operator: '' }]);
    const [apiUrls1, setApiUrls1] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showTotalStats, setShowTotalStats] = useState(false);

    useEffect(() => {
      if (apiUrls1.length > 0) {
        fetchPlayers();
      }
    }, [apiUrls1, showTotalStats]);
  
    useEffect(() => {
      setSubmit(false);
      setLoading(false);
    }, [year, conditions, conditions.length, showTotalStats]);
  
    const getApiUrls = () => {
      const baseUrl = `https://www.balldontlie.io/api/v1/season_averages`;
      const perPage = 100;
      const playerIds = Object.keys(PlayerIdMap);
      const apiUrl = `${baseUrl}?per_page=${perPage}&season=${year}&player_ids[]=`;
      let urlsArray = [];
      let url = apiUrl;
      const maxCharacterCount = 8000;
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
      setApiUrls1(urlsArray);
    };
  
    const filterPlayers = (players) => {
      return players.filter((player) => {
        return conditions.every((condition) => {
          let value = player[condition.key];
          if (showTotalStats) {
            value *= player['games_played'];
          }
  
          switch (condition.operator) {
            case '<':
              return value < condition.value;
            case '<=':
              return value <= condition.value;
            case '=':
              return value == condition.value;
            case '>':
              return value > condition.value;
            case '>=':
              return value >= condition.value;
            default:
              return true;
          }
        });
      });
    };

    const fetchPlayers = async () => {
      let allPlayers = [];
      setLoading(true);
      let errorOccurred = false; 
      let errorToastShown = false; 
      
      try {
        for (let url of apiUrls1) {
          let response = await fetch(url);
    
          if (!response.ok) {
            errorOccurred = true; 
            throw new Error('An error occurred while fetching data. Please try again in one minute');
          }
    
          let data = await response.json();
          allPlayers.push(...data.data);
        }
    
        if (!errorOccurred) {
          const playersMeetingConditions = filterPlayers(allPlayers);
          setFilteredPlayers(playersMeetingConditions);
        }
      } catch (error) {
        setLoading(false);
        setSubmit(false);
      } finally {
        setLoading(false);
        if (errorOccurred && !errorToastShown) { 
          errorToastShown = true;
          toast.error('An error occurred while fetching data. Please try again in one minute', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
  };
  
    
    
    const handleAddCondition = () => {
      if (loading) {
        toast.error('Please wait for table to load', {
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
      setConditions((prev) => [...prev, { key: '', value: '', operator: '' }]);
    };
  
    const handleRemoveCondition = (index) => {
      if (loading) {
        toast.error('Please wait for table to load', {
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
      setConditions((prev) => prev.filter((_, i) => i !== index));
    };
  
    const handleInputChange = (e, index, field) => {
      if (loading) {
        toast.error('Please wait for table to load', {
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
      const newConditions = [...conditions];
      newConditions[index][field] = e.target.value;
      setConditions(newConditions);
    };
  
    const handleYearChange = (e) => {
      if (loading) {
        toast.error('Please wait for table to load', {
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
      setYear(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();

      if (loading) {
        toast.error('Please wait for table to load', {
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
      if (!year || conditions.some((condition) => !condition.key || !condition.operator || !condition.value)) {
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
      getApiUrls();
      fetchPlayers();
      setSubmit(true);
    };
  
    const handleToggleStatsType = () => {
      if (loading) {
        toast.error('Please wait for table to load', {
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
      setShowTotalStats((prev) => !prev);
    };
  
    return (
      <div >
        {loading && <LoadingAnimation minHeight='450px' maxHeight='450px' minWidth='100%' maxWidth='100%'/>}
        <div>
          {!submit && (
            <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: windowDimensions.height * 0.3, 
              maxHeight: windowDimensions.height * 0.9, 
              width: windowDimensions.width, 
              overflow: 'auto',
              position: 'relative',
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
                Enter year and enter conditions to filter by
              </p>
            </div>
          )}
         {!loading && submit && filteredPlayers.length === 0 &&
          <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '450px',
            maxHeight: '450px',
            minWidth: '100%',
            maxWidth: '600px',
            overflow: 'auto',
            position: 'relative',
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
            No players found
          </p>
        </div>
         
         }
          {!loading && submit && filteredPlayers.length !== 0 && (
            <div style={{ minHeight: '450px', minWidth: '100%', maxHeight: '450px', maxWidth: '100%', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', paddingRight: '10px' }}>Player Name</th>
                    {conditions.map((condition, index) => (
                      <th key={index} style={{ textAlign: 'center' }}>{condition.key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player, index) => (
                    <tr key={index}>
                      <td>{PlayerIdMap[player.player_id]}</td>
                      {conditions.map((condition, index) => {
                        let value = player[condition.key];
                        if (showTotalStats) {
                          value *= player['games_played'];
                        }
                        return (
                          <td key={index} style={{ textAlign: 'center' }}>
                            {showTotalStats ? Math.ceil(value) : value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    
        <form onSubmit={handleSubmit}>
    <div style={{ 
      display: 'flex', 
      flexDirection: windowDimensions.width <= 768 ? 'column' : 'row', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
            <label style={{ fontSize: '20px' }}>
              Year:
              <input style={{ padding: '2.5px', marginTop: '8px', marginLeft: '3px'}} type="number" value={year} onChange={handleYearChange} />
            </label>
    
            <button style={styles.buttonStyle} type="button" onClick={handleAddCondition}>
              Add Condition
            </button>
    
            <button style={styles.buttonStyle} type="submit">Submit</button>
    
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
    
          <div style={{ marginTop: '10px' }}>
            {conditions.map((condition, index) => (
              <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                  <label>
                    Stat:
                    <select
                      value={condition.key}
                      onChange={(e) => handleInputChange(e, index, 'key')}
                      style={{ marginLeft: '5px', padding: '3.5px' }}
                    >
                      <option value="">--Select--</option>
                      {possibleStats.map((stat) => (
                        <option key={stat.key} value={stat.key}>
                          {stat.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div style={{ marginLeft: '10px' }}>
                  <label>
                    Operator:
                    <select
                      value={condition.operator}
                      onChange={(e) => handleInputChange(e, index, 'operator')}
                      style={{ marginLeft: '5px', padding: '3.5px' }}
                    >
                      <option value="">Select</option>
                      {operators.map((operator) => (
                        <option key={operator} value={operator}>
                          {operator}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div style={{ marginLeft: '10px', marginBottom: '4px' }}>
                  <label>
                    Value:
                    <input
                      type="number"
                      value={condition.value}
                      onChange={(e) => handleInputChange(e, index, 'value')}
                      style={{ padding: '2.5px', marginLeft: '3px' }}
                    />
                  </label>
                </div>
                {conditions.length > 1 && (
                  <button
                    style={{
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '5px',
                      marginBottom: '6.5px',
                    }}
                    className="remove-btn"
                    type="button"
                    onClick={() => handleRemoveCondition(index)}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>
    );
    
    
    
  };
  
  
  

  


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
    width: '100%', 
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
      <div className = "llb" style ={{flex:'1'}}>
        {!submitted || !numPlayers || !year || !selectedStat ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minWidth:windowDimensions.width*0.2, maxWidth: windowDimensions.width, minHeight: '400px', maxHeight: windowDimensions.height }}>
            <p>Enter a year and a stat to view the top players of that season</p>
          </div>
        ) : isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px',  minWidth:'400px', maxWidth: windowDimensions.width, minHeight: '400px', maxHeight: windowDimensions.height }}>
            <LoadingAnimation/>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth:'400px', maxWidth: windowDimensions.width, maxHeight: windowDimensions.height, overflow:'overlay' }}>
            <span style={{ margin: '5px' }}>
              Top {numPlayers} {getKeyLabel(selectedStat)} {showTotalStats ? 'total' : 'per game'} of the {year} season:
            </span>
            {leaders.map((leader, index) => (
              <div key={index} style={{ marginBottom: '10px', overflow:'scroll'}}>
                <span style={{ fontWeight: 'bold', marginRight:'4px' }}>{index + 1}.</span><span>{PlayerIdMap[leader.player_id]}:</span>
                <span style ={{marginRight:'2px'}}> {showTotalStats && selectedStat === "min" && Math.ceil(convertMinutesToTotalMinutes(leader[selectedStat]) * leader.games_played)}{showTotalStats  && selectedStat!=="min" && Math.ceil(leader[selectedStat] * leader.games_played)} </span> <span>{!showTotalStats && leader[selectedStat]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );

};



  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setModalIsOpen(false);
  };

  const handlePlayerNameChange = (index, value) => {
    const updatedInputs = [...playerInputs];
    updatedInputs[index].playerName = value;
    setPlayerInputs(updatedInputs);
  };

  const handleStartYearChange = (index, value) => {
    const updatedInputs = [...playerInputs];
    updatedInputs[index].startYear = value;
    setPlayerInputs(updatedInputs);
  };

  const handleEndYearChange = (index, value) => {
    const updatedInputs = [...playerInputs];
    updatedInputs[index].endYear = value;
    setPlayerInputs(updatedInputs);
  };

  const addPlayerInput = () => {
    const newPlayerInput = { id: playerInputs.length + 1, playerName: '', startYear: '', endYear: '' };
    setPlayerInputs([...playerInputs, newPlayerInput]);
  };

  const handleStatChange = (stat) => {
    if (selectedStats.includes(stat)) {
      setSelectedStats(selectedStats.filter((selectedStat) => selectedStat !== stat));
    } else {
      setSelectedStats([...selectedStats, stat]);
    }
  };

  const handleToggleStatsType = () => {
    setShowTotalStats(!showTotalStats);
  };
  const handleRemovePlayer = (index) => {
    const updatedPlayersData = playersData.filter((_, i) => i !== index);
    setPlayersData(updatedPlayersData);
  
    const updatedPlayerInputs = playerInputs.filter((_, i) => i !== index).map((input, i) => ({ ...input, id: i }));
    setPlayerInputs(updatedPlayerInputs);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let missingFields = false;
    let tooManyRequestsError = false;
  
    const playerInputsCopy = [...playerInputs];
    setPlayerInputsCopy(playerInputsCopy);
  
    const playerPromises = playerInputs.map(async (playerInput) => {
      const { playerName, startYear, endYear } = playerInput;
      if (playerName === '' || startYear === '' || endYear === '') {
        missingFields = true;
        return null;
      }
  
      const response = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${playerName}`);
      const playerId = response.data.data[0]?.id;
      if (playerId === undefined) {
        missingFields = true;
        toast.error(`Player '${playerName}' year or name invalid`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return null;
      }
  
      const start = Number(startYear);
      const end = Number(endYear);
  
      if (start > end) {
        missingFields = true;
        toast.error(`Invalid date range for '${playerName}`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return null;
      }
  
      const years = Array.from({ length: end - start + 1 }, (_, index) => start + index);
      const yearPromises = years.map(async (year) => {
        try {
          const statResponse = await axios.get(
            `https://www.balldontlie.io/api/v1/season_averages?season=${year}&player_ids[]=${playerId}`
          );
          const playerStat = statResponse.data.data[0];
          if (playerStat === undefined) {
            missingFields = true;
            toast.error(`No stats available for '${playerName}' in ${year}`, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            return null;
          }
  
          return playerStat;
        } catch (error) {
          if (error.response && error.response.status === 429) {
            tooManyRequestsError = true;
            setTooManyRequests(true);
            throw new Error('Too many requests');
          }
          throw error;
        }
      });
  
      const playerStats = await Promise.all(yearPromises);
      const filteredPlayerStats = playerStats.filter((playerStat) => playerStat !== null);
  
      const averagedStats = {};
      selectedStats.forEach((stat) => {
        if (showTotalStats) {
          if (stat === 'games_played') {
            averagedStats[stat] = filteredPlayerStats.reduce((sum, playerStat) => sum + playerStat[stat], 0);
          } else if (stat === 'min') {
            averagedStats[stat] = Math.ceil(
              filteredPlayerStats.reduce((sum, playerStat) => sum + convertMinutesToTotalMinutes(playerStat[stat]) * playerStat.games_played, 0)
            );
          } else {
            averagedStats[stat] = Math.ceil(
              filteredPlayerStats.reduce((sum, playerStat) => sum + playerStat[stat] * playerStat.games_played, 0)
            );
          }
        } else {
          if (stat === 'min') {
            averagedStats[stat] =
              filteredPlayerStats.reduce((sum, playerStat) => sum + convertMinutesToTotalMinutes(playerStat[stat]), 0) / filteredPlayerStats.length;
          } else {
            averagedStats[stat] =
              filteredPlayerStats.reduce((sum, playerStat) => sum + playerStat[stat], 0) / filteredPlayerStats.length;
          }
        }
      });
  
      return averagedStats;
    });
  
    try {
      const playerStats = await Promise.all(playerPromises);
      const filteredPlayerStats = playerStats.filter((playerStat) => playerStat !== null);
  
      if (missingFields) {
        toast.error('Please enter all fields', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setPlayersData(filteredPlayerStats);
      }
    } catch (error) {
      if (!tooManyRequestsError) {
        console.log(error);
        toast.error('An error occurred while fetching data', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  
    setSubmitted(true);
  };
  
 
  const chartData = {
    labels: selectedStats.map((stat) => possibleStats.find((s) => s.key === stat)?.label || ''),
    datasets: playersData.map((playerData, index) => ({
      label: `${playerInputsCopy[index].playerName} (${playerInputsCopy[index].startYear} - ${playerInputsCopy[index].endYear})`,
      data: selectedStats.map((stat) => playerData[stat] || 0),
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, 0.5)`,
    })),
  };

  return (
    <>
   <Modal
  isOpen={modalIsOpen}
  onRequestClose={() => setModalIsOpen(false)}
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      padding: '40px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '50%',
      height: '50%',
      justifyContent:'flex-start',
    
    },
  }}
  contentLabel="Option Modal"
>
  <h1>Select an Option</h1>
  <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ position: 'relative' }}>
      <button  data-tooltip-id="i"
      style={{ ...styles.buttonStyle, width: '200px' }} onClick={() => handleOptionSelect('Individual')}>
        Individual
      </button>
      <Tooltip id="i" place="right" effect="solid" multiline={true} multilineMaxWidth={200}  style ={{width:'200px'}}>
        Players' individual stats
      </Tooltip>
    </div>
  </div>
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ position: 'relative' }}>
      <button  data-tooltip-id="ll"
      style={{ ...styles.buttonStyle, width: '200px' }} onClick={() => handleOptionSelect('League Leaders')}>
        League Leaders
      </button>
      <Tooltip id="ll" place="right" effect="solid" multiline={true}  style ={{width:'200px'}}>
        Statistical leaders in various categories
      </Tooltip>
    </div>
  </div>
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ position: 'relative' }}>
      <button
        data-tooltip-id="c"
        style={{ ...styles.buttonStyle, width: '200px' }}
        onClick={() => handleOptionSelect('Conditions')}
      >
        Conditions
      </button>
      <Tooltip id="c" place="right" effect="solid" multiline={true} style ={{width:'200px'}}>
        Sort players based on specified conditions
      </Tooltip>
    </div>
  </div>
</div>


</Modal>

      {!modalIsOpen && selectedOption === 'Individual' && (
        <div className="compare-panel" style={styles.comparePanelStyle}>
          <div className="chart-container" style={styles.chartContainerStyle}>
            {playersData.length > 0 && selectedStats.length > 0 ? (
              <div className="chart" style={{ width: '100%', height: '90%' }}>
                <Bar data={chartData} options={fgOptions} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <p style={{ fontSize: '24px', textAlign: 'center', transform: 'translateY(-50%)' }}>Enter player names and select stats to compare</p>
                <div style={{ alignItems: 'center' }}>
                  <FaInfoCircle
                    style={{ color: '#17408b', fontSize: '20px', marginLeft: '5px', verticalAlign: 'middle', transform: 'translateY(-70%)' }}
                    data-tooltip-id="info-tooltip"
                    data-tooltip-content="Years refer to the starting year of the season. For example, 2022 refers to the 2022-23 season"
                  />
                  <Tooltip id="info-tooltip" />
                </div>
              </div>
            )}
          </div>
          <div style={styles.inputContainerStyle}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {possibleStats.map((stat) => (
                  <div
                    key={stat.key}
                    onClick={() => handleStatChange(stat.key)}
                    style={{
                      padding: '10px',
                      margin: '10px',
                      border: '1px solid black',
                      borderRadius: '5px',
                      backgroundColor: selectedStats.includes(stat.key) ? '#25549b' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ marginRight: '5px' }} />
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button type="button" onClick={addPlayerInput} style={styles.buttonStyle}>
                Add Player
              </button>
           
                <button type="submit" style={styles.buttonStyle}>
                  Compare
                </button>
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

              {playerInputs.map((playerInput, index) => (
  <div className="player-card" key={playerInput.id} style={styles.inputRowStyle}>
    <Autocomplete 
      value={playerInput.playerName}
      onChange={(e, {newValue}) => handlePlayerNameChange(index, newValue)}
      isComponentA = {true}
    />
    <input
      type="number"
      placeholder="Start year"
      value={playerInput.startYear}
      onChange={(e) => handleStartYearChange(index, e.target.value)}
      style={{   flex: '1 0 calc(33% - 20px)',
      margin: '0 10px',
      padding: '5px',
      borderRadius: '4px',
       width: '100px',
       height:'42.5px' }}
    />
    <input
      type="number"
      placeholder="End year"
      value={playerInput.endYear}
      onChange={(e) => handleEndYearChange(index, e.target.value)}
      style={{   flex: '1 0 calc(33% - 20px)',
      padding: '5px',
      borderRadius: '4px',
       width: '100px',
       height:'42.5px' ,
      marginRight:'3px'}}
    />
    {playerInputs.length > 1 && (
      <button
        style={{
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '6.5px',
        }}
        className="remove-btn"
        type="button"
        onClick={() => handleRemovePlayer(index)}
      >
        <FaTimes />
      </button>
    )}
  </div>
))}

 
            </form>
          </div>
        </div>
      )}

      {!modalIsOpen && selectedOption === 'League Leaders' && (
        <div className="compare-panel" style={styles.comparePanelStyle}>
          <h1>League Leaders</h1>
          <LeagueLeaders />
        </div>
      )}

      {!modalIsOpen && selectedOption === 'Conditions' && (
        <div className="compare-panel" style={styles.comparePanelStyle}>
         <Conditions/>
        </div>
      )}
    </>
  );
};






export default Compare;