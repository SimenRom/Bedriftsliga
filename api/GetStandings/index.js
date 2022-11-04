import { getStandingTable } from '../apiCalls.js';
// import { getStandings } from '../firestoreHandler.js';


export async function GetStandings(context, req) {
    
    const requestedLobbyId = req.query.lobbyId;
    const lobby = await getStandingTable(requestedLobbyId); //getStandings(requestedLobbyId);//


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: lobby,
        contentType: 'application/json'
    };
}