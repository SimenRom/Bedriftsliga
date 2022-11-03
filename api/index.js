import express from 'express';
import cors from 'cors';
import {createStandingTable} from './apiCalls.js'

const app = express()
app.use(cors({
    origin: '*'
}));

var tableCached = [];

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
        const newTbl = await createStandingTable(lobbyId);
        tableCached.push({id: lobbyId, table: newTbl, time: Date.now()})
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