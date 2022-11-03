import './App.css';
import { useEffect, useState } from 'react'

function App() {
  var [standings, setStandings] = useState([]);
  useEffect(()=>{
    async function getStandings(){
      const temp = await fetch('http://localhost:8080/createStandingTable').then(data => data.json());
      //const test = await fetch('http://localhost:8080/test').then(data => data.json());
      //console.log(test);
      setStandings(temp);
    }
    getStandings();
  }, []);
  return (
    <div className="App">
      {standings.length || <p>No data</p>}
      <table>
      <tbody>
        <tr>
          <th>Team</th>
          <th>Points</th>
          <th>won/lost/draws</th>
          <th>played</th>
        </tr>
        {standings.map(standing => <tr key={standing.teamId}>
          <td>{standing.teamName}</td>
          <td>{standing.points}</td>
          <td><span className="win">{standing.wins}</span> / <span className="lost">{standing.losses}</span> / <span className="draw">{standing.draws}</span></td>
          <td>{standing.played}</td>
        </tr>)}
        </tbody>
      </table>
    </div>  
  );
}

export default App;
