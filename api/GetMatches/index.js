import { getLobbyMatches } from '../apiCalls.js';


export async function GetStandings(context, req) {
    
    const requestedLobbyId = req.query.lobbyId;
    const matches = await getLobbyMatches(requestedLobbyId); //getStandings(requestedLobbyId);//

    //const name = (req.query.name || (req.body && req.body.name));

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: matches,
        contentType: 'application/json'
    };
}