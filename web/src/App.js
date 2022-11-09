import './App.css';
import { useEffect, useState } from 'react'
import DivisionSelector from './components/DivisionSelector';
import RoundSelector from './components/RoundSelector';
import TeamSelector from './components/TeamSelector';
import { getLobbyMatches, getStandingTable } from './apiCalls.js';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWFcJ6xwGWEkwea8B-71qSDopyf5am35s",
  authDomain: "bedriftsligascoreboard.firebaseapp.com",
  projectId: "bedriftsligascoreboard",
  storageBucket: "bedriftsligascoreboard.appspot.com",
  messagingSenderId: "824627697886",
  appId: "1:824627697886:web:e9b004a09187c5f072ca4f",
  measurementId: "G-R59S8KETE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
    if(!newLobby?.id){
      setStandings();
      return;
    }
    try {

      logEvent(analytics, 'user_selected_lobby', {
        lobbyId: newLobby.id,
        lobbyName: newLobby.name
      });
      const cached = cachedStandings.standings.find(l => l.lobbyId === newLobby.id);
      if(cached) {
        setStandings(cached.standing);
        return;
      }
      const tempStanding = await getStandingTable(newLobby.id); //await fetch(`/api/GetStandings?lobbyId=${newLobby.id}`).then(data => data.json());

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
    if(!newLobby?.id){
      setCurrentSelectedMatches([]);
      return;
    }
    try {
      const cached = cachedMatches.find(m => m.lobbyId === newLobby.id);
      if(cached) {
        setCurrentSelectedMatches(cached.matches);
        return;
      }
      const tempMatches = await getLobbyMatches(newLobby.id); //await fetch(`/api/GetMatches?lobbyId=${newLobby.id}`).then(data => data.json());
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
    setSelectedLobby(newLobby);
    loadStandings(newLobby);
    loadMatches(newLobby); 
    
  }


  useEffect(()=>{
    logEvent(analytics, 'screen_view', {
      firebase_screen: 'Landing', 
    });
  }, [])

  return (
    <div className="App">
      <DivisionSelector season={"2022H"} selectNewLobby={selectNewLobby} selectedLobby={selectedLobby}/>
      
      {selectedLobby && <table>
        <tbody>
          <tr>
            <th>Team</th>
            <th>Points</th>
            <th>W / D / L</th>
            <th>played</th>
          </tr>
          {standings?.map(standing => <tr key={standing.teamId} className={standing.teamId === selectedTeam ? 'selectedTeam' : ''}>
            <td>{standing.teamName}</td>
            <td>{standing.points}</td>
            <td><span className="win">{standing.wins}</span> / <span className="draw">{standing.draws}</span> / <span className="lost">{standing.losses}</span></td>
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
      {selectedLobby && <div className='matchesTableWrapper'><table className='matchesTable'>
        <tbody>
            <tr>
              {(!selectedRound) && <th>Round</th>}
              <th>Home</th>
              <th>Result</th>
              <th>Away</th>
              <td><div className="spreadContent"><div>Map 1</div><div className="scoreWrapper">(score)</div></div></td>
              <td><div className="spreadContent"><div>Map 2</div><div className="scoreWrapper">(score)</div></div></td>
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
              <td>{match.hasForfeited ? 'Forfeit' : match.completedAt ? `${match.teamScores[0]?.value} - ${match.teamScores[1]?.value}` : 'New'}</td>
              <td>{match.teamsFormatted.team2.name}</td>
              <td>{match.completedAt && <div className="spreadContent"><div>{`${match.matchScore.match1.map}`}</div><div className="scoreWrapper">{`${match.matchScore.match1.scoreTeam1}-${match.matchScore.match1.scoreTeam2}`}</div></div>}</td>
              <td>{match.completedAt && <div className="spreadContent"><div>{`${match.matchScore.match2.map}`}</div><div className="scoreWrapper">{`${match.matchScore.match2.scoreTeam1}-${match.matchScore.match2.scoreTeam2}`}</div></div>}</td>
              <td><a href={`https://app.masterblaster.gg/lobby/${selectedLobby.id}/Matches/${match.roundIndex}`}>{`${match.name}`}</a></td>
              <td>{!match.hasForfeited && match.completedAt !== null && <div className="spaceAround"><a href={`https://app.masterblaster.gg/api/matches/cs/demos/download/${match.id}/map/1`}>{match.matchScore.match1.map}</a> - <a href={`https://app.masterblaster.gg/api/matches/cs/demos/download/${match.id}/map/2`}>{match.matchScore.match2.map}</a></div>}</td>
            </tr>)}
        </tbody>
      </table>
      </div>}
      {!selectedLobby && <div className='informationBox'>
        Hei! Eg tar i mot bugs, ideer og tilbakemeldinger på Discord direktemelding: <a href='https://discordapp.com/users/211542559061704705'>Simen#1337</a>.
        <br/>Eg jobber for tiden med å vise meir utdypa statistikk for spillere og lag, samt bedre støtte for mobil.
        <br/>Dataen er henta fra Masterblaster sitt api 8. november 2022. 
        </div>}
    </div>  
  );
}

export default App;
