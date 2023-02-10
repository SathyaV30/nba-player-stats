import axios from "axios";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

const Compare = () => {
  const [playersData, setPlayersData] = useState([{},{}]);
  const [player_1, setPlayer_1] = useState('')
  const [player_2, setPlayer_2] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const player1 = document.getElementById('p1').value;
    const player2 = document.getElementById('p2').value;
    const year1 = document.getElementById('year1').value;
    const year2 = document.getElementById('year2').value;

    if (player1 === '' || player2 === '' || year1 === '' || year2 === '') {
      alert('Please enter all fields')
      return

    }

    if (player1 === player2) {
      setPlayer_1(player1 + ' ' + `(${year1})`)
      setPlayer_2(player2 + ' ' + `(${year2})`)
    } else {
      setPlayer_1(player1)
      setPlayer_2(player2)
    }
  
    axios
      .get(`https://www.balldontlie.io/api/v1/players?search=${player1}`)
      .then(id1Response => {
        const id1 = id1Response.data.data[0].id;
        if (id1 === undefined) {
          setPlayersData([{},{}])
          setPlayer_1('')
          alert('Player #1 year or name invalid')
          return
        }
        axios
          .get(`https://www.balldontlie.io/api/v1/season_averages?season=${year1}&player_ids[]=${id1}`)
          .then(stat1Response => {
            const stat1 = stat1Response.data.data[0];
            axios
              .get(`https://www.balldontlie.io/api/v1/players?search=${player2}`)
              .then(id2Response => {
                const id2 = id2Response.data.data[0].id;
                if (id2 === undefined) {
                  setPlayersData([{},{}])
                  setPlayer_1('')
                  alert('Player #2 year or name invalid')
                  return
                }
                axios
                  .get(`https://www.balldontlie.io/api/v1/season_averages?season=${year2}&player_ids[]=${id2}`)
                  .then(stat2Response => {
                    const stat2 = stat2Response.data.data[0];
                    if (stat1 === undefined) {
                      setPlayersData([{},{}])
                      setPlayer_1('')
                      alert('Player #1 year or name invalid')
                      return
                    } 
                    if (stat2 === undefined) {
                      setPlayersData([{},{}])
                      setPlayer_2('')
                      alert('Player #2 year or name invalid')
                      return
                    }
          
                    setPlayersData([stat1, stat2]);
                  });
              });
          });
      });
  };
  

  const data = {
    labels: ['Pts', 'Ast', 'Reb', 'Stl', 'Blk', 'Games Played'],
    datasets: [
      {
        label: player_1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)',
        data: [
          playersData[0].pts,
          playersData[0].ast,
          playersData[0].reb,
          playersData[0].stl,
          playersData[0].blk,
          playersData[0].games_played
        ]
      },
      {
        label: player_2,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        data: [
          playersData[1].pts,
          playersData[1].ast,
          playersData[1].reb,
          playersData[1].stl,
          playersData[1].blk,
          playersData[1].games_played
        ]
      }
    ]
  };


var chart = <div/>
if (player_1.length !== 0) {
chart =  (<div className = 'chart'>
<Bar
  data={data}
  width={100}
  height={50}
  options={{
    maintainAspectRatio: false
  }}
/>
</div>)
} 
  
  return (
    <>
      <h1>Compare</h1>
      <div className="cmp">
        <form onSubmit={handleSubmit}>
        <input
           type="number"
           min="1979"
           max="2019"
           step="1"
           placeholder="Enter year for Player #1"
           className="year-input-2"
           id="year1"
         />
         <input
           type="number"
           min="1979"
           max="2019"
           step="1"
           placeholder="Enter year for Player #2"
           className="year-input-2"
           id="year2"
         />
         <input type="text" placeholder="Enter Player #1" id="p1" />
         <input type="text" placeholder="Enter Player #2" id="p2" />
         <input type="submit" value="Submit" />
        </form>
      </div>
      
     
       {chart}
     
    </>
  );
 }
export default Compare;  