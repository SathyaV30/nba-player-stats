import axios from "axios";
import { useState } from "react";
import Chart from 'chart.js/auto'
import { Bar } from 'react-chartjs-2';

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

const comparePanelStyle = {
  flex: 1,
  display:'flex',
  flexDirection:'column',
  height: '100vh',
  zIndex: '100',
};

const chartContainerStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  placeItems: 'center',
  height: '80vh',
};

const chartStyle = {
  width: '100%',
  height:'100%',
};

const inputContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const inputStyle = {
  flex: '1 0 calc(33% - 20px)',
  margin: '10px',
};

const possibleStats = ['pts', 'ast', 'reb', 'stl', 'blk', 'games_played', 'fg_pct', 'fg3_pct', 'ft_pct','oreb','dreb','turnover','pf'];

const Compare = () => {
  const [playersData, setPlayersData] = useState([]);
  const [playerInputs, setPlayerInputs] = useState([{ id: 1, playerName: '', year: '' }]);
  const [selectedStats, setSelectedStats] = useState([]);

  const handlePlayerNameChange = (index, value) => {
    const updatedInputs = [...playerInputs];
    updatedInputs[index].playerName = value;
    setPlayerInputs(updatedInputs);
  };

  const handleYearChange = (index, value) => {
    const updatedInputs = [...playerInputs];
    updatedInputs[index].year = value;
    setPlayerInputs(updatedInputs);
  };

  const addPlayerInput = () => {
    if (playerInputs.length >= 14) {
      alert('You can only compare up to 14 players.');
      return;
    }
    const newPlayerInput = { id: playerInputs.length + 1, playerName: '', year: '' };
    setPlayerInputs([...playerInputs, newPlayerInput]);
  };

  const handleStatChange = (stat) => {
    if (selectedStats.includes(stat)) {
      setSelectedStats(selectedStats.filter((selectedStat) => selectedStat !== stat));
    } else {
      setSelectedStats([...selectedStats, stat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const playerPromises = playerInputs.map(async (playerInput) => {
      const { playerName, year } = playerInput;
      if (playerName === '' || year === '') {
        alert('Please enter all fields');
        return null;
      }

      const response = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${playerName}`);
      const playerId = response.data.data[0]?.id;

      if (playerId === undefined) {
        alert(`Player '${playerName}' year or name invalid`);
        return null;
      }

      const statResponse = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=${year}&player_ids[]=${playerId}`);
      const playerStat = statResponse.data.data[0];

      if (playerStat === undefined) {
        alert(`Player '${playerName}' year or name invalid`);
        return null;
      }

      return playerStat;
    });

    const playerStats = await Promise.all(playerPromises);
    const filteredPlayerStats = playerStats.filter((playerStat) => playerStat !== null);
    setPlayersData(filteredPlayerStats);
  };

  const statComparison = playersData.length > 0 && (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Stat Comparison</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', borderBottom: '1px solid black' }}>Stat</th>
            {playerInputs.map((input, index) => (
              <th key={input.id} style={{ padding: '10px', borderBottom: '1px solid black' }}>{`${input.playerName} (${input.year})`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedStats.map((statKey) => {
            let maxStatValue;
            if (statKey === 'min') {
              maxStatValue = Math.max(
                ...playersData.map((data) => {
                  const timeComponents = data[statKey].split(':');
                  const minutes = parseInt(timeComponents[0], 10);
                  const seconds = parseInt(timeComponents[1], 10);
                  return minutes * 60 + seconds;
                })
              );
            } else {
              maxStatValue = Math.max(...playersData.map((data) => data[statKey]));
            }

            return (
              <tr key={statKey}>
                <td style={{ padding: '10px', borderBottom: '1px solid black' }}>{statKey}</td>
                {playersData.map((playerStat, playerIndex) => {
                  const statValue =
                    statKey === 'min'
                      ? parseInt(playerStat[statKey].split(':')[0], 10) * 60 +
                        parseInt(playerStat[statKey].split(':')[1], 10)
                      : playerStat[statKey];
                  const isLeadingStat = statValue === maxStatValue;
                  return (
                    <td
                      key={playerIndex}
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid black',
                        fontWeight: isLeadingStat ? 'bold' : 'normal',
                      }}
                    >
                      {playerStat[statKey]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)',
    
    'rgba(255, 99, 132, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(255, 205, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(201, 203, 207, 0.6)',
    'rgba(255, 99, 132, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(201, 203, 207, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(201, 203, 207, 1)',
  ];

  const chart = playersData.length !== 0 && (
    <div style={chartContainerStyle}>
      <div style={chartStyle}>
        <Bar
          data={{
            labels: selectedStats,
            datasets: playersData.map((playerStat, index) => ({
              label: `${playerInputs[index].playerName} (${playerInputs[index].year})`,
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length + colors.length/2],
              borderWidth: 1,
              hoverBackgroundColor: colors[index % colors.length +  + colors.length/2],
              hoverBorderColor: colors[index % colors.length  + colors.length/2],
              data: selectedStats.map((statKey) => playerStat[statKey])
            }))
          }}
          options={{
            fgOptions
          }}
        />
      </div>
    </div>
  );

  const handleRemovePlayer = (index) => {
    const updatedPlayersData = [...playersData];
    updatedPlayersData.splice(index, 1);
    setPlayersData(updatedPlayersData);

    const updatedPlayerInputs = [...playerInputs];
    updatedPlayerInputs.splice(index, 1);
    setPlayerInputs(updatedPlayerInputs);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', placeItems: 'center', width: '100%' }}>
        <div style={comparePanelStyle}>
          <h1 style={{ textAlign: 'center', margin:'5px auto'}}>Compare</h1>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {playerInputs.map((playerInput, index) => (
                <div key={playerInput.id} style={{ width: `${playerInputs.length <= 6 ? '100%' : '50%'}`, padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <input
                        type="number"
                        min="1979"
                        max="2022"
                        step="1"
                        placeholder={`Enter year`}
                        value={playerInput.year}
                        onChange={(e) => handleYearChange(index, e.target.value)}
                        style={{ marginRight: '10px', margin: "5px", width: '45%' }}
                      />
                      <input
                        type="text"
                        placeholder={`Enter Player`}
                        value={playerInput.playerName}
                        onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                        style={{ marginRight: '10px', margin: "5px", width: '45%' }}
                        className= 'txt_input'
                      />
                    </div>
                    {playerInputs.length > 1 && (
                      <button className="remove-btn" type="button" onClick={() => handleRemovePlayer(index)}>
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button style={{ marginBottom: '5px', height: '40px', padding: '10px' }} className="like-btn" type="button" onClick={addPlayerInput}>
                Add Player
              </button>
              <input type="submit" value="Submit" className="like-btn" style={{ height: '40px', padding: '10px' }} />
            </div>
          </form>
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Select Stats</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {possibleStats.map((stat) => (
                <div
                  key={stat}
                  onClick={() => handleStatChange(stat)}
                  style={{
                    padding: '10px',
                    margin: '5px',
                    border: '1px solid black',
                    borderRadius: '5px',
                    backgroundColor: selectedStats.includes(stat) ? 'lightblue' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {stat}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={chartContainerStyle}>
          <div style={chartStyle}>
            {chart}
          </div>
        </div>
      </div>
      <div style={{ display: 'block' }}>
        {statComparison}
      </div>
    </>
  );}
  
export default Compare;