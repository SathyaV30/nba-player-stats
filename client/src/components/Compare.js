import axios from 'axios';
import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import Modal from 'react-modal';
import { PlayerIdMap } from './PlayerIdMap';
import './ToggleSwitch.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingAnimation from './Loading';
import Autocomplete from './Autocomplete';
import '../App.css'
import Conditions from './Conditions';
import LeagueLeaders from './LeagueLeaders';
import { useContext } from 'react';
import { ThemeContext } from '../Auth';

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


export const possibleStats = [
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

export const convertMinutesToTotalMinutes = (minutes) => {
  const [min, sec] = minutes.split(":");
  return parseInt(min) + parseInt(sec) / 60;
};

const Compare = () => {

  const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
  const [playersData, setPlayersData] = useState([]);
  const [playerInputs, setPlayerInputs] = useState([{ id: 1, playerName: '', startYear: '', endYear: '' }]);
  const [selectedStats, setSelectedStats] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Individual');
  const [showTotalStats, setShowTotalStats] = useState(false);
  const [playerInputsCopy, setPlayerInputsCopy] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [cachedData, setCachedData] = useState([]);
  const [inputsChanged, setInputsChanged] = useState(false);
  const {theme} = useContext(ThemeContext);


  useEffect(() => {
    if (cachedData.length > 0) {
      const processedData = cachedData.map((playerStats) => {
        const processedStats = {};
        selectedStats.forEach((stat) => {
          if (showTotalStats) {
            if (stat === 'games_played') {
              processedStats[stat] = playerStats.reduce((sum, playerStat) => sum + playerStat[stat], 0);
            } else if (stat === 'min') {
              processedStats[stat] = Math.ceil(
                playerStats.reduce((sum, playerStat) => sum + convertMinutesToTotalMinutes(playerStat[stat]) * playerStat.games_played, 0)
              );
            } else if (stat.includes('pct')) { 
              processedStats[stat] =
                playerStats.reduce((sum, playerStat) => sum + playerStat[stat], 0) / playerStats.length;
            } else {
              processedStats[stat] = Math.ceil(
                playerStats.reduce((sum, playerStat) => sum + playerStat[stat] * playerStat.games_played, 0)
              );
            }
          } else {
            if (stat === 'min') {
              processedStats[stat] =
                playerStats.reduce((sum, playerStat) => sum + convertMinutesToTotalMinutes(playerStat[stat]), 0) / playerStats.length;
            } else {
              processedStats[stat] =
                playerStats.reduce((sum, playerStat) => sum + playerStat[stat], 0) / playerStats.length;
            }
          }
        });
        return processedStats;
      });
      setPlayersData(processedData);
    }
  }, [selectedStats, showTotalStats, inputsChanged]);

  
  
  
 
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
      flexDirection: windowDimensions.width <=768 ? 'column' : 'row',
      alignItems:'center',
    },
    inputStyle: {
      flex: '1 0 calc(33% - 20px)',
      margin: '3px auto',
      padding: '5px',
      borderRadius: '4px',
      border: '0.8px solid #17408b',
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

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setModalIsOpen(false);
  };

  const handlePlayerNameChange = (index, value) => {
    const updatedInputs = [...playerInputs];
    updatedInputs[index].playerName = value;
    setPlayerInputs(updatedInputs);
    setInputsChanged(true);
  };

  const handleStartYearChange = (index, value) => {
    const updatedInputs = [...playerInputs];
    updatedInputs[index].startYear = value;
    setPlayerInputs(updatedInputs);
    setInputsChanged(true);
  };

  const handleEndYearChange = (index, value) => {
    const updatedInputs = [...playerInputs];
    updatedInputs[index].endYear = value;
    setPlayerInputs(updatedInputs);
    setInputsChanged(true);
  };

  const addPlayerInput = () => {
    const newPlayerInput = { id: playerInputs.length + 1, playerName: '', startYear: '', endYear: '' };
    setPlayerInputs([...playerInputs, newPlayerInput]);
    setInputsChanged(true);
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
    setIsLoading(true);
  
    let missingFields = false;
    let tooManyRequestsError = false;
    
    const playerInputsCopy = [...playerInputs];
    setPlayerInputsCopy(playerInputsCopy);
  
    const playerPromises = playerInputs.map(async (playerInput) => {
      const { playerName, startYear, endYear } = playerInput;
      if (playerName === '' || startYear === '' || endYear === '' || selectedStats.length == 0) {
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
            throw new Error('Too many requests');
          }
          throw error;
        }
      });
  
      const playerStats = await Promise.all(yearPromises);
      const filteredPlayerStats = playerStats.filter((playerStat) => playerStat !== null);
  
      return filteredPlayerStats;
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
        setCachedData(filteredPlayerStats);
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
    setIsLoading(false);
    setInputsChanged(false);
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
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    content: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: theme === 'light' ? '#f1f1f1' : '#353535',
      padding: '40px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: windowDimensions.width <=768 ? '85%' : '50%',
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
          {playersData.length > 0 && selectedStats.length > 0 && !inputsChanged ? (
  <div className="chart" style={{ width: '100%', height: '90%' }}>
    <Bar data={chartData} options={fgOptions} />
  </div>
) : !loading ? (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <p style={{ fontSize: '24px', textAlign: 'center', transform: 'translateY(-50%)' }}>Enter player names and select stats to compare</p>
  </div>
) : <LoadingAnimation minHeight='90%' maxHeight='90%' minWidth='100%' maxWidth='100%'/>}

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
                      border: '0.8px solid #17408B',
                      borderRadius: '5px',
                      backgroundColor: selectedStats.includes(stat.key) ? '#17408B' : 'transparent',
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
       width: windowDimensions.width <= 768 ? windowDimensions.width * 0.6 :windowDimensions.width * 0.3,
       height:'48px' ,
       fontSize: '1.2em',
       padding: '10px',
       border: '0.8px solid #17408B',
       borderRadius: '5px',
       boxShadow: '0px 0px 1px #ccc',
       marginLeft:'3px',
       marginRight:'3px',
       marginTop:windowDimensions.width<=768 ? '3px' : '',
       backgroundColor: theme == 'light' ? '#f1f1f1' : '#353535',
    color: theme == 'light' ? '#353535' : '#e8e5e5',
}}
       
    />
    <input
      type="number"
      placeholder="End year"
      value={playerInput.endYear}
      onChange={(e) => handleEndYearChange(index, e.target.value)}
      style={{   flex: '1 0 calc(33% - 20px)',
      width: windowDimensions.width <= 768 ? windowDimensions.width * 0.6 :windowDimensions.width * 0.3,
       height:'48px',
       fontSize: '1.2em',
       padding: '10px',
       border: '0.8px solid #17408B',
       borderRadius: '5px',
       boxShadow: '0px 0px 1px #ccc',
       marginTop:windowDimensions.width<=768 ? '3px' : '',
       backgroundColor: theme == 'light' ? '#f1f1f1' : '#353535',
       color: theme == 'light' ? '#353535' : '#e8e5e5',
  
    }}
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
