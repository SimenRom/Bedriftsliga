import express from 'express';
import cors from 'cors';
import { createStandingTable, createLobbyMatches, createTeamsInfo } from './apiCalls.js'

const app = express()
app.use(cors({
    origin: '*'
}));

var tableCached = [];
var lobbyMatchesCache = [];
var teamsInfoCache = [];

async function getTeamsInfo(lobbyId){
    const existingTeamsInfo = teamsInfoCache.find(o => o.lobbyId === lobbyId);
    if(!existingTeamsInfo){
        const newInfo = await createTeamsInfo(lobbyId);
        teamsInfoCache.push({lobbyId: lobbyId, info: newInfo, time: Date.now()});
        return newInfo;
    }
    return existingTeamsInfo.info;
    
}

async function getLobby(lobbyId){
    const existing = tableCached.find(tbl => tbl.id === lobbyId);
    if(existing && Date.now() - existing.time < 600000){ // 600000 = 10 minutes
        return existing.table;
    } else {
        if(existing){
            const index = tableCached.findIndex(table=>table.id === existing.id);
            if(index > -1){
                tableCached.splice(index, 1);
            }
        }
        const newTbl = await createStandingTable(lobbyId, await getTeamsInfo(lobbyId));
        tableCached.push({id: lobbyId, table: newTbl, time: Date.now()})
        return newTbl;
    }
}

async function getMatches(lobbyId){
    const existing = lobbyMatchesCache.find(matches => matches.id === lobbyId);
    if(existing && Date.now() - existing.time < 600000){ // 600000 = 10 minutes
        return existing.matches;
    } else {
        if(existing){
            const index = lobbyMatchesCache.findIndex(matches=>matches.id === existing.id);
            if(index > -1){
                lobbyMatchesCache.splice(index, 1);
            }
        }
        const newMatches = await createLobbyMatches(lobbyId, await getTeamsInfo(lobbyId));
        lobbyMatchesCache.push({id: lobbyId, matches: newMatches, time: Date.now()});
        return newMatches;
    }
}

app.get('/createStandingTable', async function (req, res) {
    const requestedLobbyId = req.query.lobbyId;
    res.send(await getLobby(requestedLobbyId));
})

app.get('/getLobbyMatches', async function (req, res) {
    const requestedLobbyId = req.query.lobbyId;
    res.send(await getMatches(requestedLobbyId));

})

app.listen(8080);
console.log('Api running on port 8080');