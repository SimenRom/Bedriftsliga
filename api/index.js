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
var tableCached = await createStandingTable()

app.get('/createStandingTable', async function (req, res) {
    res.send(tableCached);
})

app.listen(8080);
console.log('Api running on port 8080');