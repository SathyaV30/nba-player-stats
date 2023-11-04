
import { useState, useEffect, useContext } from 'react';
import {  FaTimes } from 'react-icons/fa';
import { PlayerIdMap } from './PlayerIdMap';
import './ToggleSwitch.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingAnimation from './Loading';
import '../App.css'
import { possibleStats } from './Compare';
import { ThemeContext } from '../Auth';

const Conditions = () => {
    const operators = ['<', '<=', '=', '>', '>='];
    const [year, setYear] = useState(null);
    const [conditions, setConditions] = useState([{ key: '', value: '', operator: '' }]);
    const [apiUrls1, setApiUrls1] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showTotalStats, setShowTotalStats] = useState(false);
    const {theme} = useContext(ThemeContext)

    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
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
      } else if (year < 1979 || year > 2023) {
        toast.error('Data is limited between 1979 and 2023', {
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
      <div>
        {loading && <LoadingAnimation minHeight={windowDimensions.height * 0.6} maxHeight={windowDimensions.height * 0.6} minWidth='100%' maxWidth='100%'/>}
        <div>
          {!submit && (
            <div
              style={{
                display: 'flex',
                flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: windowDimensions.height * 0.6, 
                maxHeight: windowDimensions.height * 0.6, 
                width: '100%', 
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
                flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight:windowDimensions.height * 0.6, 
                maxHeight: windowDimensions.height * 0.6, 
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
            <div 
              style={{ 
                minHeight: windowDimensions.height * 0.6, 
                minWidth: '100%', 
                maxHeight: windowDimensions.height * 0.6 , 
                maxWidth: '100%', 
                overflow: 'auto', 
                display: 'flex', 
                justifyContent: window.innerWidth <= 768 ? 'flex-start' : 'center' 
              }}
            >
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
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: window.innerWidth <= 768 ? 'column' : 'row', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            <label style={{ fontSize: '20px' }}>
              Year:
              <input style={{ padding:'8px', fontSize:'1.2rem', marginTop: '10px', marginLeft: '3px',marginRight:'10px', border:'0.8px solid #17408B', borderRadius:'5px',
            backgroundColor: theme == 'light' ? '#f1f1f1' : '#353535',
            color: theme == 'light' ? '#353535' : '#e8e5e5',}} type="number" value={year} onChange={handleYearChange} />
            </label>
            <button style={styles.buttonStyle} type="button" onClick={handleAddCondition}>
              Add Condition
            </button>
            <button style={styles.buttonStyle} type="submit">Submit</button>
            <div style = {{margin:windowDimensions.width<=768 ? '10px' : '0px'}}>
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
          <div style={{ marginTop: '10px' }}>
            {conditions.map((condition, index) => (
              <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: windowDimensions.width <= 768 ? 'flex-start' : 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <label style = {{marginLeft:'3px'}}>
                  Stat:
                  <select
                    value={condition.key}
                    onChange={(e) => handleInputChange(e, index, 'key')}
                    style={{ marginLeft: '5px', padding: '5px',borderRadius:'5px', border:'0.8px solid #17408B',backgroundColor: theme == 'light' ? '#f1f1f1' : '#353535',
                    color: theme == 'light' ? '#353535' : '#e8e5e5',  }}
                  >
                    <option value="">Select</option>
                    {possibleStats.map((stat) => (
                      <option key={stat.key} value={stat.key}>
                        {stat.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <label style={{ marginLeft: '3px'}}>
                  Operator:
                  <select
                    value={condition.operator}
                    onChange={(e) => handleInputChange(e, index, 'operator')}
                    style={{ marginLeft: '5px', padding: '5px',borderRadius:'5px', border:'0.8px solid #17408B',backgroundColor: theme == 'light' ? '#f1f1f1' : '#353535',
                    color: theme == 'light' ? '#353535' : '#e8e5e5', }}
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
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: windowDimensions.width <=768 ? 'flex-start' : 'center' }}>
                <label style={{ marginLeft: '3px'}}>
                  Value:
                  <input
                    type="number"
                    value={condition.value}
                    onChange={(e) => handleInputChange(e, index, 'value')}
                   style={{ padding: '5px', marginLeft: '3px', border:'0.8px solid', borderRadius:'5px',
                    backgroundColor: theme == 'light' ? '#f1f1f1' : '#353535',
                   color: theme == 'light' ? '#353535' : '#e8e5e5',}}
                   
                  />
                </label>
              </div>
              {conditions.length > 1 && (
                 <div
                 style={{
                   display: windowDimensions.width<=768 ? 'flex' :'',
                   alignItems: windowDimensions.width<=768 ?'center' :'none',
                   justifyContent:windowDimensions.width<=768 ?'center' :'none', 
                   width:windowDimensions.width<=768 ? '100%' :'none',
                 }}
               >
                <button
                  style={{
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '5px',
                    marginBottom: '19.5px',
                    marginTop:windowDimensions.width <=768 ? '-8px' : '8px'
                  }}
                  className="remove-btn"
                  type="button"
                  onClick={() => handleRemoveCondition(index)}
                >
                  <FaTimes />
                </button>
                </div>
              )}
            </div>
            
            ))}
          </div>
        </form>
      </div>
    );
    
    
    
  };
  export default Conditions;