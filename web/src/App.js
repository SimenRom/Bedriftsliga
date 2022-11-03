import './App.css';
import { useEffect, useState } from 'react'
import DivisionSelector from './components/DivisionSelector';
// const Lobbies = require('./Lobbies.json');

function App() {
  var [standings, setStandings] = useState([]);
  var [selectedLobby, setSelectedLobby] = useState();//Lobbies['2022H'].find(l=>l.name === 'Div3A'));
  var [cachedStandings, setCachedStandings] = useState({
    standings: [],
  });
  async function selectNewLobby(newLobby){
    setSelectedLobby(newLobby);
    if(!newLobby.id){
      setStandings();
      return;
    }
    try {
      const cached = cachedStandings.standings.find(l => l.lobbyId === newLobby.id);
      if(cached) {
        setStandings(cached.standing);
        return;
      }
      const temp = await fetch(`http://localhost:8080/createStandingTable?lobbyId=${newLobby.id}`).then(data => data.json());
      setStandings(temp);
      var newCache = cachedStandings;
      newCache.standings.push({
        lobbyId: newLobby.id,
        standing: temp
      });
      setCachedStandings(newCache);
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(()=>{
    //console.log(selectedLobby)
  }, [selectedLobby])
  return (
    <div className="App">
      <DivisionSelector season={"2022H"} selectNewLobby={selectNewLobby} selectedLobby={selectedLobby}/>
      <table>
      <tbody>
        <tr>
          <th>Team</th>
          <th>Points</th>
          <th>won/lost/draw</th>
          <th>played</th>
        </tr>
        {standings?.map(standing => <tr key={standing.teamId}>
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
