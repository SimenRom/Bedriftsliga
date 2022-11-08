import Matches1 from './Data/Matches_1.json';
import Matches2 from './Data/Matches_2.json';
import Matches3a from './Data/Matches_3a.json';
import Matches3b from './Data/Matches_3b.json';
import Matches3c from './Data/Matches_3c.json';
import Matches4a from './Data/Matches_4a.json';
import Matches4b from './Data/Matches_4b.json';
import Matches4c from './Data/Matches_4c.json';
import Matches5a from './Data/Matches_5a.json';
import Matches5b from './Data/Matches_5b.json';

import Standings1 from './Data/Standings_Div1.json';
import Standings2 from './Data/Standings_Div2.json';
import Standings3a from './Data/Standings_Div3a.json';
import Standings3b from './Data/Standings_Div3b.json';
import Standings3c from './Data/Standings_Div3c.json';
import Standings4a from './Data/Standings_Div4a.json';
import Standings4b from './Data/Standings_Div4b.json';
import Standings4c from './Data/Standings_Div4c.json';
import Standings5a from './Data/Standings_Div5a.json';
import Standings5b from './Data/Standings_Div5b.json';

import Teaminfo1 from './Data/Teaminfo_1.json';
import Teaminfo2 from './Data/Teaminfo_2.json';
import Teaminfo3a from './Data/Teaminfo_3a.json';
import Teaminfo3b from './Data/Teaminfo_3b.json';
import Teaminfo3c from './Data/Teaminfo_3c.json';
import Teaminfo4a from './Data/Teaminfo_4a.json';
import Teaminfo4b from './Data/Teaminfo_4b.json';
import Teaminfo4c from './Data/Teaminfo_4c.json';
import Teaminfo5a from './Data/Teaminfo_5a.json';
import Teaminfo5b from './Data/Teaminfo_5b.json';

import Lobbies from './Lobbies.json';

const AllData = {
    Div1: {
        matches: Matches1,
        teamsInfo: Teaminfo1,
        standing: Standings1,
    },
    Div2: {
        matches: Matches2,
        teamsInfo: Teaminfo2,
        standing: Standings2,
    },
    Div3A: {
        matches: Matches3a,
        teamsInfo: Teaminfo3a,
        standing: Standings3a,
    },
    Div3B: {
        matches: Matches3b,
        teamsInfo: Teaminfo3b,
        standing: Standings3b,
    },
    Div3C: {
        matches: Matches3c,
        teamsInfo: Teaminfo3c,
        standing: Standings3c,
    },
    Div4A: {
        matches: Matches4a,
        teamsInfo: Teaminfo4a,
        standing: Standings4a,
    },
    Div4B: {
        matches: Matches4b,
        teamsInfo: Teaminfo4b,
        standing: Standings4b,
    },
    Div4C: {
        matches: Matches4c,
        teamsInfo: Teaminfo4c,
        standing: Standings4c,
    },
    Div5A: {
        matches: Matches5a,
        teamsInfo: Teaminfo5a,
        standing: Standings5a,
    },
    Div5B: {
        matches: Matches5b,
        teamsInfo: Teaminfo5b,
        standing: Standings5b,
    }
}

export function getStandings(id){
    const lobbyName = Lobbies['2022H'].find(l => l.id === id).name;
    return AllData[lobbyName].standing;
}
export function fetchTeamsInfo(id){
    const lobbyName = Lobbies['2022H'].find(l => l.id === id).name;
    return AllData[lobbyName].teamsInfo;
}
export function fetchLobbyMatches(id){
    const lobbyName = Lobbies['2022H'].find(l => l.id === id).name;
    return AllData[lobbyName].matches;
}