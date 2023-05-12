import axios from "axios";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

const comparePanelStyle = {
  width: '50%',
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
  width:'60vh',
};

const chartStyle = {
  height: '80vh',
  width:'60vh',
  
};



const Compare = () => {
  const [playersData, setPlayersData] = useState([]);
  const [playerInputs, setPlayerInputs] = useState([{ id: 1, playerName: '', year: '' }]);
  
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
    const newPlayerInput = { id: playerInputs.length + 1, playerName: '', year: '' };
    setPlayerInputs([...playerInputs, newPlayerInput]);
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
          {Object.keys(playersData[0]).map((statKey) => {
            if (statKey !== 'player_id') {
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
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
  
  
  
    
      const data = {
        labels: ['Pts', 'Ast', 'Reb', 'Stl', 'Blk', 'Games Played'],
        datasets: playersData.map((playerStat, index) => ({
          label: `${playerInputs[index].playerName} (${playerInputs[index].year})`,
          backgroundColor: `rgba(${index * 70}, 99, 132, 0.2)`,
          borderColor: `rgba(${index * 70}, 99, 132, 1)`,
          borderWidth: 1,
          hoverBackgroundColor: `rgba(${index * 70}, 99, 132, 0.4)`,
          hoverBorderColor: `rgba(${index * 70}, 99, 132, 1)`,
          data: [
            playerStat?.pts,
            playerStat?.ast,
            playerStat?.reb,
            playerStat?.stl,
            playerStat?.blk,
            playerStat?.games_played,
          ]
        }))
      };
    
      const fgData = {
        labels: ['FG%', '3PT%', 'FT%'],
        datasets: playersData.map((playerStat, index) => ({
          label: `${playerInputs[index].playerName} (${playerInputs[index].year})`,
          backgroundColor: `rgba(${index * 70}, 99, 132, 0.2)`,
          borderColor: `rgba(${index * 70}, 99, 132, 1)`,
          borderWidth: 1,
          hoverBackgroundColor: `rgba(${index * 70}, 99, 132, 0.4)`,
          hoverBorderColor: `rgba(${index * 70}, 99, 132, 1)`,
          data: [
            playerStat?.fg_pct,
            playerStat?.fg3_pct,
            playerStat?.ft_pct,
          ]
        }))
      };
    
      const fgChart = playerInputs.length !== 0 && (
        <div style={chartContainerStyle}>
          <div style={chartStyle}>
            <Bar
              data={fgData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
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
    
      const chart = playersData.length !== 0 && (
        <div style={chartContainerStyle}>
          <div style={chartStyle}>
            <Bar
              data={data}
              options={{
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          </div>
        </div>
      );
    
      return (
        <>
        <div style={{ display: 'flex', flexDirection:'row', justifyContent:'start', width: '100%'}}>
          <div style={comparePanelStyle}>
            <h1 style={{ textAlign: 'center'}}>Compare</h1>
            <form className="form-2" onSubmit={handleSubmit} style={{ justifyContent:'baseline' }}>
              {playerInputs.map((input, index) => (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', placeItems: 'center' }} key={input.id}>
                  <input
                    type="number"
                    min="1979"
                    max="2022"
                    step="1"
                    placeholder={`Enter year`}
                    className="year-input-2"
                    value={input.year}
                    onChange={(e) => handleYearChange(index, e.target.value)}
                    style={{ margin: "5px" }}
                  />
                  <input
                    type="text"
                    placeholder={`Enter Player`}
                    value={input.playerName}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    style={{ margin: "5px" }}
                  />
                  {(
                    <button className="remove-btn" type="button" onClick={() => handleRemovePlayer(index)}>
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent:'center' }}>
                <button style={{ marginBottom:'5px', height:'40px', padding:'10px' }} className="like-btn" type="button" onClick={addPlayerInput}>
                  Add Player
                </button>
                <input type="submit" value="Submit" className="like-btn" style={{ height:'40px', padding:'10px' }}/>
              </div>
            </form>
          </div>
          <div style={chartContainerStyle}>
            <div style={chartStyle}>
              {chart}
            </div>
          </div>
          <div style={chartContainerStyle}>
          <div style={chartStyle}>
            {fgChart}
          </div>
          </div>
        </div>
        <div style ={{ marginTop: '-100px'}}>
          {statComparison}
        </div>
</>
);
}



export default Compare;    