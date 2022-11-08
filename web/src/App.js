import './App.css';
import { useEffect, useState } from 'react'
import DivisionSelector from './components/DivisionSelector';
import RoundSelector from './components/RoundSelector';
import TeamSelector from './components/TeamSelector';

function App() {
  var [standings, setStandings] = useState([]);
  var [selectedLobby, setSelectedLobby] = useState();//Lobbies['2022H'].find(l=>l.name === 'Div3A'));
  var [cachedStandings, setCachedStandings] = useState({
    standings: [],
  });
  var [currentSelectedMatches, setCurrentSelectedMatches] = useState([]);
  var [cachedMatches, setCachedMatches] = useState([]);
  var [selectedTeam, setSelectedTeam] = useState();
  var [selectedRound, setSelectedRound] = useState();

  async function loadStandings(newLobby){
    setSelectedTeam();
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
      const tempStanding = await fetch(`/api/GetStandings?lobbyId=${newLobby.id}`).then(data => data.json());

      setStandings(tempStanding);
      var newCache = cachedStandings;
      newCache.standings.push({
        lobbyId: newLobby.id,
        standing: tempStanding
      });
      setCachedStandings(newCache);
    } catch (e) {
      console.log(e)
    }
  }
  async function loadMatches(newLobby){
    if(!newLobby.id){
      setCurrentSelectedMatches();
      return;
    }
    try {
      const cached = cachedMatches.find(m => m.lobbyId === newLobby.id);
      if(cached) {
        setCurrentSelectedMatches(cached.matches);
        return;
      }
      const tempMatches = await fetch(`/api/GetMatches?lobbyId=${newLobby.id}`).then(data => data.json());
      setCurrentSelectedMatches(tempMatches);
      var newCache = cachedMatches;
      newCache.push({
        lobbyId: newLobby.id,
        matches: tempMatches
      });
      setCachedMatches(newCache);
    } catch (e) {
      console.log(e)
    }
  }
  
  async function selectNewLobby(newLobby){
    const testRes = await fetch('/api/Test').then(data => data.json());
    console.log('testRes:', testRes);
    setSelectedLobby(newLobby);
    loadStandings(newLobby);
    loadMatches(newLobby); 
    
  }


  useEffect(()=>{
    // console.log(currentSelectedMatches)
  }, [currentSelectedMatches])

  return (
    <div className="App">
      <DivisionSelector season={"2022H"} selectNewLobby={selectNewLobby} selectedLobby={selectedLobby}/>
      
      {selectedLobby && <table>
        <tbody>
          <tr>
            <th>Team</th>
            <th>Points</th>
            <th>won/lost/draw</th>
            <th>played</th>
          </tr>
          {standings?.map(standing => <tr key={standing.teamId} className={standing.teamId === selectedTeam ? 'selectedTeam' : ''}>
            <td>{standing.teamName}</td>
            <td>{standing.points}</td>
            <td><span className="win">{standing.wins}</span> / <span className="lost">{standing.losses}</span> / <span className="draw">{standing.draws}</span></td>
            <td>{standing.played}</td>
          </tr>)}
        </tbody>
      </table>}
      <br/>
      {selectedLobby && <div>
          <span>Filter by round and team</span>
          <RoundSelector rounds={currentSelectedMatches.map(m => m.name.substring(0, 2)).filter((value, index, self) => self.indexOf(value) === index)} selectedRound={selectedRound} setSelectedRound={setSelectedRound}/>
          <TeamSelector standings={standings} selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam}/>
        </div>}
      {selectedLobby && <table>
        <tbody>
            <tr>
              {(!selectedRound) && <th>Round</th>}
              <th>Home</th>
              <th>Points</th>
              <th>Away</th>
              <td><div className="mapColumn"><div>Map 1</div><div className="scoreWrapper">(score)</div></div></td>
              <td><div className="mapColumn"><div>Map 2</div><div className="scoreWrapper">(score)</div></div></td>
              <th>MB-url</th>
              <th>Demo download</th>
            </tr>
            {currentSelectedMatches.filter(match => match.name.substring(0, 2) === selectedRound || !selectedRound).filter(match=>{
              if(selectedTeam){
                return match.teamIds.some(teamId => teamId === selectedTeam);
              } else return true;
            }).map(match => <tr key={match.name}>
              {(!selectedRound) && <td>{match.roundIndex}</td>}
              <td>{match.teamsFormatted.team1.name}</td>
              <td>{match.hasForfeited ? 'forfeit' : `${match.teamScores[0]?.value} - ${match.teamScores[1]?.value}`}</td>
              <td>{match.teamsFormatted.team2.name}</td>
              <td><div className="mapColumn"><div>{`${match.matchScore.match1.map}`}</div><div className="scoreWrapper">{`${match.matchScore.match1.scoreTeam1}-${match.matchScore.match1.scoreTeam2}`}</div></div></td>
              <td><div className="mapColumn"><div>{`${match.matchScore.match2.map}`}</div><div className="scoreWrapper">{`${match.matchScore.match2.scoreTeam1}-${match.matchScore.match2.scoreTeam2}`}</div></div></td>
              <td><a href={`https://app.masterblaster.gg/lobby/${selectedLobby.id}/Matches/${match.roundIndex}`}>{`${match.name}`}</a></td>
              {!match.hasForfeited && <td><a href={`https://app.masterblaster.gg/api/matches/cs/demos/download/${match.id}/map/1`}>{match.matchScore.match1.map}</a> - <a href={`https://app.masterblaster.gg/api/matches/cs/demos/download/${match.id}/map/2`}>{match.matchScore.match2.map}</a></td>}
            </tr>)}
        </tbody>
      </table>}
      
    </div>  
  );
}

export default App;
