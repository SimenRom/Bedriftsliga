import express from 'express';
import cors from 'cors';
import {createStandingTable} from './apiCalls.js'

const app = express()
app.use(cors({
    origin: '*'
}));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
//   });
var tableCached = [];

async function getLobby(lobbyId){
    const existing = tableCached.find(tbl => tbl.id === lobbyId);
    if(existing){
        //console.log("Found existing:", existing.id);
        return existing.table;
    } else {
        const newTbl = await createStandingTable(lobbyId);
        tableCached.push({id: lobbyId, table: newTbl})
        console.log("Cached:", tableCached.length);
        //console.log("No existing for:", lobbyId);
        return newTbl;
    }
}

app.get('/createStandingTable', async function (req, res) {
    const requestedLobbyId = req.query.lobbyId;
    // console.log(req.query);
    res.send(await getLobby(requestedLobbyId));
})

app.listen(8080);
console.log('Api running on port 8080');